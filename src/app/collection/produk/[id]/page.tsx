/* eslint-disable @next/next/no-html-link-for-pages */
// src/app/collection/produk/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Product = {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
  status: boolean;
  kategori: string;
  produk_gambar: { url: string }[];
};

export default function ProdukDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('produk')
        .select(`
          id,
          nama,
          deskripsi,
          harga,
          status,
          kategori,
          produk_gambar (
            url
          )
        `)
        .eq('id', resolvedParams.id)
        .single();

      if (error || !data) {
        console.error('Gagal memuat detail produk:', error?.message);
        notFound();
        return;
      }

      setProduct({
        ...data,
        status: data.status === true || data.status === 1 || data.status === 'true'
      });
      setLoading(false);
    };

    fetchProduct();
  }, [resolvedParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-40">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200 border-t-gray-900"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const images = product.produk_gambar || [];
  const hasMultipleImages = images.length > 1;
  const whatsappLink = `https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20produk:%20${encodeURIComponent(product.nama)}`;

  const getCategoryDisplayName = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'baju': return 'SHIRT';
      case 'celana': return 'PANTS';
      case 'sepatu': return 'SHOES';
      case 'tas': return 'BAGS';
      default: return category?.toUpperCase() || 'PRODUCT';
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const truncatedDescription = product.deskripsi?.split('\n').slice(0, 2).join('\n') || '';
  const shouldShowReadMore = product.deskripsi && product.deskripsi.split('\n').length > 2;

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-geist-sans)]">
      <Navbar />

      {/* Tambahkan pt-24 agar breadcrumb tidak ketutupan navbar */}
      <div className="pt-24">
        {/* Breadcrumb */}
        <div className="w-full bg-gray-50/50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <nav className="flex items-center space-x-3 text-sm font-light text-gray-600">
              <a 
                href="/" 
                className="hover:text-gray-900 transition-colors uppercase tracking-[0.1em] hover:underline underline-offset-4">
                Home
              </a>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <a 
                href="/collection" 
                className="hover:text-gray-900 transition-colors uppercase tracking-[0.1em] hover:underline underline-offset-4">
                Collection
              </a>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <a 
                href={`/collection/${product.kategori?.toLowerCase()}`}
                className="hover:text-gray-900 transition-colors uppercase tracking-[0.1em] hover:underline underline-offset-4">
                {getCategoryDisplayName(product.kategori)}
              </a>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 uppercase tracking-[0.1em] font-normal">
                {product.nama}
              </span>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <main className="w-full">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
              
              {/* Image Gallery */}
              <div className="space-y-6">
                {/* Main Image */}
                <div className="relative group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-sm">
                    {images.length > 0 ? (
                      <>
                        <img
                          src={images[currentImageIndex]?.url || '/no-image.jpg'}
                          alt={product.nama}
                          className={`w-full h-full object-cover transition-all duration-700 ${
                            !product.status ? 'filter blur-sm grayscale' : 'group-hover:scale-105'
                          }`}
                        />
                        
                        {/* SOLD Overlay */}
                        {!product.status && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="bg-red-600/95 backdrop-blur-sm px-8 py-4 rounded-sm border border-red-500/50">
                              <span className="text-white font-light tracking-[0.3em] text-lg uppercase">
                                SOLD OUT
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Navigation Arrows for Mobile */}
                        {hasMultipleImages && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all lg:opacity-0 lg:group-hover:opacity-100"
                            >
                              <ChevronLeft className="h-5 w-5 text-gray-800" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all lg:opacity-0 lg:group-hover:opacity-100"
                            >
                              <ChevronRight className="h-5 w-5 text-gray-800" />
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 font-light">No Image Available</span>
                      </div>
                    )}
                  </div>

                  {/* Image Counter */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-light">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Grid (Desktop) */}
                {hasMultipleImages && (
                  <div className="hidden lg:grid grid-cols-4 gap-3">
                    {images.slice(0, 8).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative aspect-square overflow-hidden bg-gray-50 rounded-sm transition-all ${
                          currentImageIndex === index 
                            ? 'ring-2 ring-gray-900 ring-offset-2' 
                            : 'hover:opacity-80'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${product.nama} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="space-y-8">
                {/* Product Title & Price */}
                <div className="space-y-4">
                  <h1 className="text-3xl lg:text-4xl font-light tracking-wide text-gray-900 leading-tight">
                    {product.nama}
                  </h1>
                  <div className="flex items-baseline gap-4">
                    <span className={`text-2xl lg:text-3xl font-light ${
                      product.status ? 'text-gray-900' : 'text-gray-400 line-through'
                    }`}>
                      Rp {product.harga.toLocaleString('id-ID')}
                    </span>
                    {!product.status && (
                      <span className="text-sm font-light text-red-600 uppercase tracking-wide">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-light text-gray-900 uppercase tracking-[0.1em]">
                    Description
                  </h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 font-light leading-relaxed whitespace-pre-line">
                      {showFullDescription ? product.deskripsi : truncatedDescription}
                    </p>
                    {shouldShowReadMore && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="mt-2 text-sm font-light text-gray-900 hover:text-gray-700 uppercase tracking-wide underline underline-offset-4 transition-colors"
                      >
                        {showFullDescription ? 'Show Less' : 'Read More'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Availability Status */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      product.status ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className={`text-sm font-light uppercase tracking-wide ${
                      product.status ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {product.status ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-8">
                  {product.status ? (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full lg:w-auto px-12 py-4 bg-gray-900 text-white font-light tracking-[0.1em] uppercase hover:bg-gray-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                    >
                      Contact via WhatsApp
                    </a>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center justify-center w-full lg:w-auto px-12 py-4 bg-gray-300 text-gray-500 font-light tracking-[0.1em] uppercase cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  )}
                </div>

                {/* Additional Info */}
                <div className="pt-8 border-t border-gray-100 space-y-4">
                  <div className="grid grid-cols-1 gap-4 text-sm font-light text-gray-600">
                    <div className="flex justify-between">
                      <span className="uppercase tracking-wide">Category</span>
                      <span>{getCategoryDisplayName(product.kategori)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="uppercase tracking-wide">Product ID</span>
                      <span>#{product.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}