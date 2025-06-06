'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Upload, X, Image as ImageIcon, Package, Tag, DollarSign, FileText, Save, AlertCircle, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface Produk {
  id: string
  nama: string
  deskripsi: string
  harga: number
  kategori: string
  status: boolean
}

interface ProdukGambar {
  id: string
  produk_id: string
  url: string
  storage_path?: string // Tambahkan field untuk menyimpan path storage
}

export default function EditProdukPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [produk, setProduk] = useState<Produk | null>(null)
  const [gambarList, setGambarList] = useState<ProdukGambar[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const [form, setForm] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    kategori: '',
    status: true
  })

  // Fungsi untuk mengekstrak nama file dari URL public Supabase
  const extractFileNameFromUrl = (url: string): string => {
    if (url.includes('/storage/v1/object/public/product-images/')) {
      // Ekstrak nama file dari URL public Supabase
      const parts = url.split('/storage/v1/object/public/product-images/')
      return parts[parts.length - 1]
    } else if (url.startsWith('http')) {
      // Fallback untuk URL lain
      const parts = url.split('/')
      return parts[parts.length - 1]
    } else {
      // Jika sudah berupa path storage
      return url
    }
  }

  const fetchProduk = useCallback(async () => {
    setIsLoading(true)
    setErrorMsg('')
    
    try {
      const { data: produkData, error } = await supabase
        .from('produk')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      const { data: gambarData } = await supabase
        .from('produk_gambar')
        .select('*')
        .eq('produk_id', id)

      if (produkData) {
        setProduk(produkData)
        setForm({
          nama: produkData.nama,
          deskripsi: produkData.deskripsi,
          harga: produkData.harga.toString(),
          kategori: produkData.kategori,
          status: produkData.status ?? true // Default ke true jika null/undefined
        })
      }

      if (gambarData) {
        const gambarDenganUrl = gambarData.map((g) => {
          let publicUrl = g.url
          let storagePath = ''

          if (g.url.startsWith('http')) {
            // Jika sudah URL lengkap, gunakan langsung dan ekstrak storage path
            publicUrl = g.url
            storagePath = extractFileNameFromUrl(g.url)
          } else {
            // Jika bukan URL lengkap, buat public URL
            const { data } = supabase.storage.from('product-images').getPublicUrl(g.url)
            publicUrl = data?.publicUrl ?? ''
            storagePath = g.url
          }

          return {
            ...g,
            url: publicUrl,
            storage_path: storagePath
          }
        })
        setGambarList(gambarDenganUrl)
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMsg(error.message || 'Gagal memuat data produk')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProduk()
  }, [fetchProduk])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusToggle = () => {
    setForm((prev) => ({ ...prev, status: !prev.status }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setNewImageFiles((prev) => [...prev, ...filesArray])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const filesArray = Array.from(e.dataTransfer.files)
      setNewImageFiles((prev) => [...prev, ...filesArray])
    }
  }

  const handleRemoveNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveExistingImage = async (gambarId: string) => {
    try {
      // Cari gambar yang akan dihapus
      const gambarToDelete = gambarList.find(g => g.id === gambarId)
      
      if (!gambarToDelete) {
        throw new Error('Gambar tidak ditemukan')
      }

      // Hapus dari database terlebih dahulu
      const { error: deleteDbError } = await supabase
        .from('produk_gambar')
        .delete()
        .eq('id', gambarId)

      if (deleteDbError) throw deleteDbError

      // Hapus file dari storage jika ada storage_path
      if (gambarToDelete.storage_path) {
        const { error: deleteStorageError } = await supabase.storage
          .from('product-images')
          .remove([gambarToDelete.storage_path])

        if (deleteStorageError) {
          console.error('Gagal menghapus file dari storage:', deleteStorageError)
          // Tidak throw error di sini karena data sudah terhapus dari database
          // Hanya log sebagai warning
        }
      }

      // Update state untuk menghapus gambar dari UI
      setGambarList((prev) => prev.filter(g => g.id !== gambarId))
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMsg('Gagal menghapus gambar: ' + error.message)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsSaving(true)

    if (!form.nama || !form.harga) {
      setErrorMsg('Nama dan harga wajib diisi')
      setIsSaving(false)
      return
    }

    try {
      // Update produk data
      const { error: updateError } = await supabase
        .from('produk')
        .update({
          nama: form.nama,
          deskripsi: form.deskripsi,
          harga: Number(form.harga),
          kategori: form.kategori,
          status: form.status
        })
        .eq('id', id)

      if (updateError) throw updateError

      // Upload new images if any
      for (const file of newImageFiles) {
        const ext = file.name.split('.').pop()
        const fileName = `${id}-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // Dapatkan public URL dan simpan URL lengkap ke database
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        const { error: insertGambarError } = await supabase
          .from('produk_gambar')
          .insert({
            produk_id: id,
            url: publicUrlData.publicUrl // Simpan URL lengkap seperti yang diinginkan
          })

        if (insertGambarError) throw insertGambarError
      }

      router.push('/admin/dashboard')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMsg(error.message || 'Gagal mengupdate produk')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data produk...</p>
        </div>
      </div>
    )
  }

  if (!produk) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Produk tidak ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Edit Produk
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Perbarui informasi produk Anda
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Error Message */}
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 font-medium">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6 sm:space-y-8">
              {/* Nama Produk */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900">
                  <Package size={18} className="text-gray-600" />
                  Nama Produk
                </label>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full text-black px-4 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Contoh: Kebaya Modern Bordir Bunga"
                  required
                />
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900">
                  <FileText size={18} className="text-gray-600" />
                  Deskripsi
                </label>
                <textarea
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={handleChange}
                  rows={4}
                  className="w-full text-black px-4 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 transition-colors duration-200 bg-gray-50 focus:bg-white resize-none"
                  placeholder="Jelaskan detail produk, bahan, ukuran, dan keunggulan kebaya..."
                />
              </div>

              {/* Grid untuk Harga, Kategori, dan Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Harga */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900">
                    <DollarSign size={18} className="text-gray-600" />
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    name="harga"
                    value={form.harga}
                    onChange={handleChange}
                    className="w-full text-black px-4 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    placeholder="500000"
                    required
                    min={0}
                  />
                </div>

                {/* Kategori */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900">
                    <Tag size={18} className="text-gray-600" />
                    Kategori
                  </label>
                  <select
                    name="kategori"
                    value={form.kategori}
                    onChange={handleChange}
                    className="w-full text-black px-4 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Baju">Baju</option>
                    <option value="Celana">Celana</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900">
                    {form.status ? (
                      <ToggleRight size={18} className="text-green-600" />
                    ) : (
                      <ToggleLeft size={18} className="text-red-600" />
                    )}
                    Status Produk
                  </label>
                  <div className="flex items-center gap-3 p-3 sm:p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                    <button
                      type="button"
                      onClick={handleStatusToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        form.status ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          form.status ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`text-sm sm:text-base font-medium ${
                      form.status ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {form.status ? 'Tersedia' : 'Terjual'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gambar yang Ada */}
              {gambarList.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <ImageIcon size={18} />
                    Gambar Saat Ini ({gambarList.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gambarList.map((gambar) => (
                      <div key={gambar.id} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                          <img
                            src={gambar.url}
                            alt="Gambar Produk"
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(gambar.id)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Gambar Baru */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900">
                  <ImageIcon size={18} className="text-gray-600" />
                  Tambah Gambar Baru
                </label>
                
                {/* Drag & Drop Area */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 ${
                    dragActive 
                      ? 'border-gray-400 bg-gray-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="p-8 sm:p-12 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload size={24} className="sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      Upload Gambar Tambahan
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-4">
                      Drag & drop gambar atau klik untuk memilih
                    </p>
                    <div className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                      <Upload size={16} className="mr-2" />
                      Pilih Gambar
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      Maksimal 10MB per gambar • PNG, JPG, JPEG
                    </p>
                  </div>
                </div>

                {/* Preview Gambar Baru */}
                {newImageFiles.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <ImageIcon size={18} />
                      Preview Gambar Baru ({newImageFiles.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {newImageFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
                          >
                            <X size={16} />
                          </button>
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-md truncate">
                              {file.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 sm:pt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-4 sm:py-5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 text-base sm:text-lg"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan Perubahan...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}