'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import { ArrowLeft, Upload, X, Image as ImageIcon, Package, Tag, DollarSign, FileText, Save, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react'

export default function CreateProdukPage() {
  const router = useRouter()
  const [nama, setNama] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [harga, setHarga] = useState('')
  const [kategori, setKategori] = useState('')
  const [status, setStatus] = useState(true) // true = tersedia, false = terjual
  const [gambarFiles, setGambarFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setGambarFiles((prev) => [...prev, ...filesArray])
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
      setGambarFiles((prev) => [...prev, ...filesArray])
    }
  }

  const handleRemoveImage = (index: number) => {
    setGambarFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsLoading(true)

    if (!nama || !harga || gambarFiles.length === 0) {
      setErrorMsg('Nama, harga, dan minimal 1 gambar wajib diisi')
      setIsLoading(false)
      return
    }

    const produkId = uuidv4()

    try {
      // 1. Insert produk
      const { error: produkError } = await supabase.from('produk').insert({
        id: produkId,
        nama,
        deskripsi,
        harga: parseInt(harga),
        kategori,
        status,
        created_at: new Date().toISOString()
      })

      if (produkError) throw produkError

      // 2. Upload semua gambar dan simpan URL-nya
      for (const file of gambarFiles) {
        const ext = file.name.split('.').pop()
        const fileName = `${produkId}-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        const { error: insertGambarError } = await supabase.from('produk_gambar').insert({
          produk_id: produkId,
          url: publicUrlData.publicUrl
        })

        if (insertGambarError) throw insertGambarError
      }

      router.push('/admin/dashboard')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMsg(error.message || 'Terjadi kesalahan saat menyimpan produk')
    } finally {
      setIsLoading(false)
    }
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
                Tambah Produk Baru
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Lengkapi informasi produk Anda
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

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Nama Produk */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900">
                  <Package size={18} className="text-gray-600" />
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full text-black px-4 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Contoh: Kebaya Modern"
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
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
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
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
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
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
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
                    {status ? (
                      <ToggleRight size={18} className="text-green-600" />
                    ) : (
                      <ToggleLeft size={18} className="text-red-600" />
                    )}
                    Status Produk
                  </label>
                  <div className="flex items-center gap-3 p-3 sm:p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setStatus(!status)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        status ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          status ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`text-sm sm:text-base font-medium ${
                      status ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {status ? 'Tersedia' : 'Terjual'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upload Gambar */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900">
                  <ImageIcon size={18} className="text-gray-600" />
                  Gambar Produk
                  <span className="text-red-500">*</span>
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
                      Upload Gambar Produk
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

                {/* Preview Gambar */}
                {gambarFiles.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <ImageIcon size={18} />
                      Preview Gambar ({gambarFiles.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {gambarFiles.map((file, index) => (
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
                            onClick={() => handleRemoveImage(index)}
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
                  disabled={isLoading}
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-4 sm:py-5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 text-base sm:text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan Produk...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Simpan Produk
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