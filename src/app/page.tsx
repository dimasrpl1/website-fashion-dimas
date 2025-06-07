"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Footer from "@/components/footer";
import Link from 'next/link';

type Product = {
  id: number;
  nama: string;
  harga: number;
  gambar: string | null; // URL gambar pertama
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("produk")
        .select(`
          id,
          nama,
          harga,
          produk_gambar (
            url
          )
        `)
        .eq("status", true) // Filter hanya produk dengan status true
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Gagal mengambil data produk:", error);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formatted = data.map((item: any) => ({
        id: item.id,
        nama: item.nama,
        harga: item.harga,
        gambar: item.produk_gambar?.[0]?.url ?? null,
      }));

      setProducts(formatted);
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] text-black bg-white overflow-x-hidden">
      <Navbar />

      {/* Container background gradasi elegant - Sophisticated neutral tones */}
      <div className="bg-gradient-to-br from-stone-50 via-gray-50/50 to-slate-100/30 overflow-x-hidden">

        {/* Hero tanpa background */}
        <Hero />

        {/* Koleksi Eksklusif Section - Luxury Fashion Style */}
        <section className="w-full overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-12 pt-2 pb-6 bg-transparent">


          {/* Header Section - Minimalist & Elegant */}
<div className="text-center mb-12 sm:mb-16 lg:mb-20">
  <div className="space-y-4 sm:space-y-6">
    <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extralight text-gray-900 tracking-wider leading-tight">
      NEW ARRIVALS
      <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-600 mt-1 sm:mt-2">
        FROM OUR COLLECTION
      </span>
    </h2>
    <div className="w-20 sm:w-28 lg:w-32 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mx-auto"></div>
    <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-light tracking-wide max-w-2xl mx-auto px-4">
      Explore the latest pieces crafted with elegance and sophistication.
    </p>
  </div>
</div>


          {/* Products Grid/Slider - Latest 4 Products Only */}
          <div className="w-full max-w-7xl mx-auto">
            <div className="relative overflow-hidden">
              <Swiper
                spaceBetween={16}
                slidesPerView={1.1}
                centeredSlides={false}
                watchOverflow={true}
                breakpoints={{
                  320: { 
                    slidesPerView: 1.1, 
                    spaceBetween: 12
                  },
                  480: { 
                    slidesPerView: 1.3, 
                    spaceBetween: 16
                  },
                  640: { 
                    slidesPerView: 2, 
                    spaceBetween: 20,
                    centeredSlides: false 
                  },
                  768: { 
                    slidesPerView: 2.2, 
                    spaceBetween: 24 
                  },
                  1024: { 
                    slidesPerView: 3, 
                    spaceBetween: 28 
                  },
                  1280: { 
                    slidesPerView: 3.5, 
                    spaceBetween: 32 
                  },
                  1440: { 
                    slidesPerView: 4, 
                    spaceBetween: 36 
                  },
                }}
                className="!pb-8 !px-0"
              >
              {products.slice(0, 4).map((product, index) => (
  <SwiperSlide key={product.id} className="!h-auto">
    <Link href={`/collection/produk/${product.id}`} className="group h-full w-full block">
      {/* Product Card - Luxury Fashion Style */}
      <div className="relative bg-white h-full w-full flex flex-col overflow-hidden transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-gray-900/10">
        
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-50 w-full" style={{ aspectRatio: '3/4' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <img
            src={product.gambar || "/default-image.png"}
            alt={product.nama}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.02]"
            loading="lazy"
          />

          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
            <span className="text-xs font-light text-white bg-black/20 backdrop-blur-sm px-2 py-1 tracking-wider">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-20">
            <span className="bg-white text-black px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-light tracking-wider hover:bg-gray-100 transition-colors duration-300 transform translate-y-4 group-hover:translate-y-0">
              VIEW DETAILS
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col justify-between w-full">
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm lg:text-base font-light text-gray-900 leading-relaxed tracking-wide line-clamp-2 group-hover:text-gray-600 transition-colors duration-300">
              {product.nama.toUpperCase()}
            </h3>
            
            <div className="space-y-2">
              <p className="text-sm sm:text-lg lg:text-xl font-light text-gray-900 tracking-wide">
                Rp{product.harga.toLocaleString("id-ID")}
              </p>
              <div className="w-6 sm:w-8 h-px bg-gray-300 group-hover:w-8 sm:group-hover:w-12 group-hover:bg-gray-600 transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  </SwiperSlide>
              ))}
            </Swiper>
            </div>
          </div>

          {/* View All Button - Luxury Style */}
          <div className="text-center mt-4 sm:mt-10 lg:mt-10">
            <button className="group relative overflow-hidden bg-transparent border border-gray-900 px-8 sm:px-12 lg:px-16 py-3 sm:py-4 font-light text-sm sm:text-base tracking-[0.2em] text-gray-900 hover:text-white transition-all duration-500 ease-out" onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = '/collection';
                      }}>
              <span className="relative z-10">SHOP NOW</span>
              <div className="absolute inset-0 bg-gray-900 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            </button>
          </div>
</section>

        {/* Category Banners Section - Compact Luxury Layout */}
        <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 lg:pb-10 bg-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              
              {/* Kategori Baju Banner */}
              <div 
                className="group relative overflow-hidden bg-gray-100 cursor-pointer" 
                style={{ aspectRatio: '5/3' }}
                onClick={() => window.location.href = '/collection/baju'}
              >
                {/* Background Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-gray-700 to-stone-800">
                  {/* Placeholder untuk gambar baju - ganti dengan URL gambar yang sesuai */}
                  <img
                    src="/image/image3.jpg"
                    alt="Kategori Baju"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-500"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8 z-10">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-extralight text-white tracking-wider leading-tight">
                        SHIRTS
                      </h3>
                      <div className="w-8 sm:w-12 h-px bg-white/60"></div>
                      <p className="text-xs sm:text-sm text-white/90 font-light tracking-wide">
                        Premium collection
                      </p>
                    </div>
                    
                    <button 
                      className="group/btn relative overflow-hidden bg-transparent border border-white/80 px-4 sm:px-6 py-2 sm:py-2.5 font-light text-xs tracking-[0.2em] text-white hover:text-gray-900 transition-all duration-500 ease-out w-fit"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = '/collection/baju';
                      }}
                    >
                      <span className="relative z-10">SHOP SHIRTS</span>
                      <div className="absolute inset-0 bg-white transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Kategori Celana Banner */}
              <div 
                className="group relative overflow-hidden bg-gray-100 cursor-pointer" 
                style={{ aspectRatio: '5/3' }}
                onClick={() => window.location.href = '/collection/celana'}
              >
                {/* Background Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-stone-600 via-gray-600 to-slate-700">
                  {/* Placeholder untuk gambar celana - ganti dengan URL gambar yang sesuai */}
                  <img
                    src="/image/celana1.jpg"
                    alt="Kategori Celana"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-500"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8 z-10">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-extralight text-white tracking-wider leading-tight">
                        PANTS
                      </h3>
                      <div className="w-8 sm:w-12 h-px bg-white/60"></div>
                      <p className="text-xs sm:text-sm text-white/90 font-light tracking-wide">
                        Tailored selection
                      </p>
                    </div>
                    
                    <button 
                      className="group/btn relative overflow-hidden bg-transparent border border-white/80 px-4 sm:px-6 py-2 sm:py-2.5 font-light text-xs tracking-[0.2em] text-white hover:text-gray-900 transition-all duration-500 ease-out w-fit"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = '/collection/celana';
                      }}
                    >
                      <span className="relative z-10">SHOP PANTS</span>
                      <div className="absolute inset-0 bg-white transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></div>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Model Gallery Section - Fashion Editorial Style */}
        <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 sm:pt-8 lg:pt-12 pb-8 sm:pb-12 lg:pb-16 bg-transparent">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extralight text-gray-900 tracking-wider leading-tight">
                  STYLED BY
                  <span className="block text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-light text-gray-600 mt-1">
                    OUR COMMUNITY
                  </span>
                </h2>
                <div className="w-16 sm:w-24 lg:w-28 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mx-auto"></div>
                <p className="text-sm sm:text-base text-gray-600 font-light tracking-wide max-w-xl mx-auto">
                  See how our pieces come to life through the lens of style
                </p>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              
              {/* Top Row - 2 Horizontal Images */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                
                {/* First Horizontal Image */}
                <div className="group relative overflow-hidden bg-gray-100 cursor-pointer" style={{ aspectRatio: '4/3' }}>
                  <img
                    src="/image/horizontal2.jpg"
                    alt="Model wearing our collection"
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
                  
                  {/* Overlay content */}
                  <div className="absolute inset-0 flex items-end justify-start p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5">
                      <p className="text-xs sm:text-sm font-light text-gray-900 tracking-wide">
                        @MODEL_01
                      </p>
                    </div>
                  </div>
                </div>

                {/* Second Horizontal Image */}
                <div className="group relative overflow-hidden bg-gray-100 cursor-pointer" style={{ aspectRatio: '4/3' }}>
                  <img
                    src="/image/horizontal1.jpg"
                    alt="Model wearing our collection"
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
                  
                  {/* Overlay content */}
                  <div className="absolute inset-0 flex items-end justify-start p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5">
                      <p className="text-xs sm:text-sm font-light text-gray-900 tracking-wide">
                        @MODEL_02
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Row - 3 Vertical Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                
                {/* First Vertical Image */}
                <div className="group relative overflow-hidden bg-gray-100 cursor-pointer" style={{ aspectRatio: '3/4' }}>
                  <img
                    src="/image/vertikal1.jpg"
                    alt="Model wearing our collection"
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
                  
                  {/* Overlay content */}
                  <div className="absolute inset-0 flex items-end justify-start p-4 sm:p-5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5">
                      <p className="text-xs sm:text-sm font-light text-gray-900 tracking-wide">
                        @MODEL_03
                      </p>
                    </div>
                  </div>
                </div>

                {/* Second Vertical Image */}
                <div className="group relative overflow-hidden bg-gray-100 cursor-pointer" style={{ aspectRatio: '3/4' }}>
                  <img
                    src="/image/vertikal2.jpg"
                    alt="Model wearing our collection"
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
                  
                  {/* Overlay content */}
                  <div className="absolute inset-0 flex items-end justify-start p-4 sm:p-5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5">
                      <p className="text-xs sm:text-sm font-light text-gray-900 tracking-wide">
                        @MODEL_04
                      </p>
                    </div>
                  </div>
                </div>

                {/* Third Vertical Image */}
                <div className="group relative overflow-hidden bg-gray-100 cursor-pointer sm:col-span-2 lg:col-span-1" style={{ aspectRatio: '3/4' }}>
                  <img
                    src="/image/vertikal3.jpg"
                    alt="Model wearing our collection"
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
                  
                  {/* Overlay content */}
                  <div className="absolute inset-0 flex items-end justify-start p-4 sm:p-5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5">
                      <p className="text-xs sm:text-sm font-light text-gray-900 tracking-wide">
                        @MODEL_05
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-8 sm:mt-12 lg:mt-16">
              <div className="space-y-4 sm:space-y-6">
                <p className="text-sm sm:text-base text-gray-600 font-light tracking-wide max-w-md mx-auto">
                  Tag us in your photos for a chance to be featured
                </p>
                <button className="group relative overflow-hidden bg-transparent border border-gray-900 px-6 sm:px-10 lg:px-12 py-2.5 sm:py-3 font-light text-sm tracking-[0.2em] text-gray-900 hover:text-white transition-all duration-500 ease-out">
                  <span className="relative z-10">#WEARYOURSTYLE</span>
                  <div className="absolute inset-0 bg-gray-900 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                </button>
              </div>
            </div>

          </div>
        </section>
      </div>
      
      {/* Tambahkan Footer di sini */}
      <Footer />
    </div>
  );
}