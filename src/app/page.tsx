"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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
        <section className="w-full overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-12 py-16 sm:py-20 lg:py-24 bg-transparent">
          {/* Header Section - Minimalist & Elegant */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extralight text-gray-900 tracking-wider leading-tight">
                ATELIER
                <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-600 mt-1 sm:mt-2">
                  COLLECTION
                </span>
              </h2>
              <div className="w-20 sm:w-28 lg:w-32 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mx-auto"></div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-light tracking-wide max-w-2xl mx-auto px-4">
                Discover our curated selection of timeless pieces
              </p>
            </div>
          </div>

          {/* Products Grid/Slider */}
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
              {products.map((product, index) => (
                <SwiperSlide key={product.id} className="!h-auto">
                  <div className="group h-full w-full">
                    {/* Product Card - Luxury Fashion Style */}
                    <div className="relative bg-white h-full w-full flex flex-col overflow-hidden transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-gray-900/10">
                      
                      {/* Image Container - Fashion Magazine Style */}
                      <div className="relative overflow-hidden bg-gray-50 w-full" style={{ aspectRatio: '3/4' }}>
                        {/* Overlay untuk efek premium */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <img
                          src={product.gambar || "/default-image.png"}
                          alt={product.nama}
                          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                        
                        {/* Subtle number indicator */}
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
                          <span className="text-xs font-light text-white bg-black/20 backdrop-blur-sm px-2 py-1 tracking-wider">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Hover overlay dengan tombol */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-20">
                          <button className="bg-white text-black px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-light tracking-wider hover:bg-gray-100 transition-colors duration-300 transform translate-y-4 group-hover:translate-y-0">
                            VIEW DETAILS
                          </button>
                        </div>
                      </div>

                      {/* Content - Minimal & Elegant */}
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
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            </div>
          </div>

          {/* View All Button - Luxury Style */}
          <div className="text-center mt-12 sm:mt-16 lg:mt-20">
            <button className="group relative overflow-hidden bg-transparent border border-gray-900 px-8 sm:px-12 lg:px-16 py-3 sm:py-4 font-light text-sm sm:text-base tracking-[0.2em] text-gray-900 hover:text-white transition-all duration-500 ease-out">
              <span className="relative z-10">EXPLORE COLLECTION</span>
              <div className="absolute inset-0 bg-gray-900 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}