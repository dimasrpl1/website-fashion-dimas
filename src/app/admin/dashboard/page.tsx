'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '../../../components/ui/button'
import { PencilIcon, PlusIcon, ChevronLeft, ChevronRight, LogOut, Package, CheckCircle, XCircle } from 'lucide-react'
// import Image from 'next/image'

interface Produk {
  id: string
  nama: string
  deskripsi: string
  harga: number
  kategori: string
  status: boolean // true = tersedia, false = terjual
  // gambar akan kita ambil terpisah
}

interface ProdukGambar {
  id: string
  produk_id: string
  url: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [produkList, setProdukList] = useState<(Produk & { gambar: ProdukGambar[] })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState<{ [produkId: string]: boolean }>({})
  // State untuk menyimpan index gambar aktif per produk
  const [activeImageIndex, setActiveImageIndex] = useState<{ [produkId: string]: number }>({})
  // State untuk touch gestures
  const [touchStart, setTouchStart] = useState<{ [produkId: string]: number }>({})
  const [touchEnd, setTouchEnd] = useState<{ [produkId: string]: number }>({})
  // State loading hapus
  const [deleting, setDeleting] = useState<{ [produkId: string]: boolean }>({})

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin')
    if (isAdmin !== 'true') {
      router.push('/admin') // Redirect ke login
    } else {
      fetchProdukDenganGambar()
    }
  }, [router])

  const fetchProdukDenganGambar = async () => {
    setIsLoading(true)
    try {
      // 1. Ambil semua produk
      const { data: produkData, error: produkError } = await supabase.from('produk').select('*')
      if (produkError) throw produkError

      // 2. Ambil semua gambar produk
      const { data: gambarData, error: gambarError } = await supabase.from('produk_gambar').select('*')
      if (gambarError) throw gambarError

      // 3. Gabungkan gambar ke masing-masing produk
      const produkDenganGambar = produkData.map((produk) => ({
        ...produk,
        gambar: gambarData.filter((g) => g.produk_id === produk.id)
      }))

      setProdukList(produkDenganGambar)

      // Inisialisasi index gambar aktif 0 untuk setiap produk
      const initialActiveIndex: { [key: string]: number } = {}
      produkDenganGambar.forEach((p) => {
        initialActiveIndex[p.id] = 0
      })
      setActiveImageIndex(initialActiveIndex)
    } catch (error) {
      console.error('Gagal mengambil data produk:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin')
    router.push('/admin')
  }

  // Fungsi untuk toggle status produk
  const toggleStatus = async (produkId: string, currentStatus: boolean) => {
    setUpdatingStatus(prev => ({ ...prev, [produkId]: true }))
    
    try {
      const { error } = await supabase
        .from('produk')
        .update({ status: !currentStatus })
        .eq('id', produkId)

      if (error) throw error

      // Update state lokal
      setProdukList(prev => prev.map(produk => 
        produk.id === produkId 
          ? { ...produk, status: !currentStatus }
          : produk
      ))
    } catch (error) {
      console.error('Gagal mengubah status produk:', error)
      alert('Gagal mengubah status produk')
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [produkId]: false }))
    }
  }

  // Fungsi untuk pindah gambar ke kiri / kanan
  const changeImageIndex = (produkId: string, direction: 'prev' | 'next') => {
    setActiveImageIndex((prev) => {
      const currentIndex = prev[produkId] ?? 0
      const gambarCount = produkList.find((p) => p.id === produkId)?.gambar.length ?? 0
      if (gambarCount === 0) return prev

      let newIndex = currentIndex
      if (direction === 'prev') {
        newIndex = currentIndex === 0 ? gambarCount - 1 : currentIndex - 1
      } else {
        newIndex = currentIndex === gambarCount - 1 ? 0 : currentIndex + 1
      }
      return { ...prev, [produkId]: newIndex }
    })
  }

  // Touch event handlers untuk mobile swipe
  const handleTouchStart = (produkId: string, e: React.TouchEvent) => {
    setTouchEnd({...touchEnd, [produkId]: 0}) // reset touchEnd
    setTouchStart({...touchStart, [produkId]: e.targetTouches[0].clientX})
  }

  const handleTouchMove = (produkId: string, e: React.TouchEvent) => {
    setTouchEnd({...touchEnd, [produkId]: e.targetTouches[0].clientX})
  }

  const handleTouchEnd = (produkId: string) => {
    if (!touchStart[produkId] || !touchEnd[produkId]) return
    
    const distance = touchStart[produkId] - touchEnd[produkId]
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      changeImageIndex(produkId, 'next')
    }
    if (isRightSwipe) {
      changeImageIndex(produkId, 'prev')
    }
  }

  // Hitung statistik produk
  const produkTersedia = produkList.filter(p => p.status === true).length
  const produkTerjual = produkList.filter(p => p.status === false).length

  // Fungsi hapus produk & gambar
  const handleDeleteProduk = async (produkId: string, gambar: ProdukGambar[]) => {
    if (!confirm('Yakin ingin menghapus produk ini beserta semua gambarnya?')) return
    setDeleting(prev => ({ ...prev, [produkId]: true }))
    try {
      // 1. Hapus gambar dari storage
      for (const g of gambar) {
        // Asumsi url gambar: https://xxxx.supabase.co/storage/v1/object/public/product-images/nama-file.jpg
        // Ambil path setelah .../product-images/
        const url = new URL(g.url)
        const path = decodeURIComponent(url.pathname.split('/product-images/')[1])
        if (path) {
          await supabase.storage.from('product-images').remove([path])
        }
      }
      // 2. Hapus data gambar dari tabel produk_gambar
      await supabase.from('produk_gambar').delete().eq('produk_id', produkId)
      // 3. Hapus data produk dari tabel produk
      await supabase.from('produk').delete().eq('id', produkId)
      // 4. Update state
      setProdukList(prev => prev.filter(p => p.id !== produkId))
    } catch (error) {
      alert('Gagal menghapus produk')
      console.error(error)
    } finally {
      setDeleting(prev => ({ ...prev, [produkId]: false }))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat koleksi fashion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Navbar yang lebih sederhana dan responsif */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between min-h-[48px] sm:min-h-[56px]">
            {/* Logo dan Judul */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex-shrink-0">
                {/* <Image
                  src="/image/logo.png"
                  alt="Diyaning Kebaya Logo"
                  fill
                  className="object-contain rounded-lg"
                  priority
                /> */}
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                  nama toko
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:block">
                  Admin Dashboard
                </p>
              </div>
            </div>
            
            {/* Tombol Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Tombol Tambah - Responsif untuk mobile */}
              <Button
                onClick={() => router.push('/admin/dashboard/create')}
                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-200 flex items-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg text-sm sm:text-base hover:scale-105 active:scale-95"
              >
                <PlusIcon size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span className="hidden xs:inline sm:inline">Tambah</span>
              </Button>
              
              {/* Tombol Logout - Responsif untuk mobile */}
              <Button
                onClick={handleLogout}
                className="border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-semibold px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-200 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base hover:scale-105 active:scale-95 shadow-sm"
              >
                <LogOut size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* Total Produk */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">Total Produk</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{produkList.length}</p>
            </div>

            {/* Produk Tersedia */}
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Tersedia</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-green-900">{produkTersedia}</p>
            </div>

            {/* Produk Terjual */}
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                <span className="text-sm font-medium text-red-700">Terjual</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-red-900">{produkTerjual}</p>
            </div>
          </div>
        </div>

        {produkList.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada produk</h3>
            <p className="text-gray-500 mb-6 px-4">Mulai dengan menambahkan produk kebaya pertama Anda</p>
            <Button
              onClick={() => router.push('/admin/dashboard/create')}
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-2.5 rounded-xl"
            >
              <PlusIcon size={18} className="mr-2" />
              Tambah Produk
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {produkList.map((produk) => {
              const gambarAktifIndex = activeImageIndex[produk.id] ?? 0
              const gambarAktif = produk.gambar[gambarAktifIndex]

              return (
                <div key={produk.id} className="group bg-white border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 hover:-translate-y-1">
                  {/* Image Container */}
                  <div 
                    className="relative aspect-[4/5] bg-gray-50 overflow-hidden cursor-pointer select-none"
                    onTouchStart={(e) => handleTouchStart(produk.id, e)}
                    onTouchMove={(e) => handleTouchMove(produk.id, e)}
                    onTouchEnd={() => handleTouchEnd(produk.id)}
                  >
                    {produk.gambar.length > 0 ? (
                      <>
                        <img
                          src={gambarAktif.url}
                          alt={`${produk.nama} - gambar ${gambarAktifIndex + 1}`}
                          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                            !produk.status ? 'grayscale opacity-60' : ''
                          }`}
                          draggable={false}
                          loading="lazy"
                        />

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            produk.status 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {produk.status ? 'Tersedia' : 'Terjual'}
                          </span>
                        </div>

                        {/* Overlay untuk produk terjual */}
                        {!produk.status && (
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <div className="bg-white bg-opacity-90 px-3 py-1 rounded-full">
                              <span className="text-sm font-semibold text-gray-800">TERJUAL</span>
                            </div>
                          </div>
                        )}

                        {/* Navigation Buttons - Only show on hover and hidden on mobile */}
                        {produk.gambar.length > 1 && (
                          <>
                            <button
                              onClick={() => changeImageIndex(produk.id, 'prev')}
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hidden md:flex"
                            >
                              <ChevronLeft size={16} className="text-gray-700" />
                            </button>

                            <button
                              onClick={() => changeImageIndex(produk.id, 'next')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hidden md:flex"
                            >
                              <ChevronRight size={16} className="text-gray-700" />
                            </button>

                            {/* Image Counter */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                              {gambarAktifIndex + 1} / {produk.gambar.length}
                            </div>

                            {/* Mobile swipe indicator */}
                            <div className="absolute top-3 right-3 md:hidden">
                              <div className="bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <span>Geser</span>
                                <ChevronLeft size={12} />
                                <ChevronRight size={12} />
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <div className="text-center">
                          <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">Tidak ada gambar</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 sm:p-5">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 text-sm sm:text-base">{produk.nama}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">{produk.deskripsi}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-base sm:text-lg font-bold text-gray-900">Rp {produk.harga.toLocaleString()}</p>
                        {produk.kategori && (
                          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full mt-1 inline-block">
                            {produk.kategori}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {/* Toggle Status Button */}
                      <Button
                        onClick={() => toggleStatus(produk.id, produk.status)}
                        disabled={updatingStatus[produk.id]}
                        className={`flex-1 px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 text-sm font-medium ${
                          produk.status
                            ? 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-200'
                            : 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-200'
                        }`}
                      >
                        {updatingStatus[produk.id] ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            {produk.status ? (
                              <>
                                <XCircle size={14} />
                                <span className="hidden sm:inline">Tandai Terjual</span>
                                <span className="sm:hidden">Terjual</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle size={14} />
                                <span className="hidden sm:inline">Tandai Tersedia</span>
                                <span className="sm:hidden">Tersedia</span>
                              </>
                            )}
                          </>
                        )}
                      </Button>

                      {/* Edit Button */}
                      <Button
                        onClick={() => router.push(`/admin/dashboard/edit/${produk.id}`)}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1 text-sm"
                      >
                        <PencilIcon size={12} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>

                      {/* Delete Button */}
                      <Button
                        onClick={() => handleDeleteProduk(produk.id, produk.gambar)}
                        disabled={deleting[produk.id]}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1 text-sm"
                      >
                        {deleting[produk.id] ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <XCircle size={14} />
                            <span className="hidden sm:inline">Hapus</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}