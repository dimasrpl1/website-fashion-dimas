"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

type Product = {
  id: number;
  nama: string;
  harga: number;
  gambar: string | null;
};

export default function CollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [loading, setLoading] = useState(true);
  const [gridView] = useState<'single' | 'double'>('double'); // Default 2 columns for mobile

  const PRODUCTS_PER_PAGE = 4;
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
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
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal mengambil data produk:", error);
        setLoading(false);
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
      setFilteredProducts(formatted);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Filter products by price
  useEffect(() => {
    let filtered = [...products];

    if (priceFilter.min || priceFilter.max) {
      filtered = products.filter(product => {
        const min = priceFilter.min ? parseInt(priceFilter.min) : 0;
        const max = priceFilter.max ? parseInt(priceFilter.max) : Infinity;
        return product.harga >= min && product.harga <= max;
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [priceFilter, products]);


  const clearFilter = () => {
    setPriceFilter({ min: '', max: '' });
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] text-black bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-wider mb-6 animate-fade-in">
              COLLECTION
            </h1>
            <p className="text-lg sm:text-xl font-extralight tracking-widest uppercase opacity-90 animate-fade-in-delay">
              Curated Excellence
            </p>
          </div>
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

      {/* Filter Section */}
      <section className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-light tracking-wide text-gray-700 uppercase">Filter by Price:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceFilter.min}
                  onChange={(e) => setPriceFilter(prev => ({ ...prev, min: e.target.value }))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceFilter.max}
                  onChange={(e) => setPriceFilter(prev => ({ ...prev, max: e.target.value }))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all"
                />
                <button
                  onClick={clearFilter}
                  className="px-4 py-2 text-xs font-light tracking-wider text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 transition-all uppercase"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="text-sm font-light text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
            </div>
          </div>
        </div>
      </section>

      

      {/* Products Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {currentProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl font-light text-gray-600">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className={`grid gap-4 ${
                gridView === 'single' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
                  : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'
              }`}>
                {currentProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative w-full h-60 sm:h-72 lg:h-80 overflow-hidden">
                      <img
                        src={product.gambar || "/default-image.png"}
                        alt={product.nama}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                    </div>
                    <div className="p-2 sm:p-3">
                      <h3 className="font-light tracking-wide text-gray-900 mb-1 group-hover:text-gray-700 transition-colors text-xs sm:text-sm">
                        {product.nama}
                      </h3>
                      <p className="font-light text-gray-800 text-xs sm:text-sm">
                        Rp {product.harga.toLocaleString("id-ID")}
                      </p>
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-16 gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-light tracking-wider text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-all uppercase"
                >
                  Previous
                </button>
                
                <div className="flex gap-1 mx-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 text-sm font-light transition-all ${
                        currentPage === page
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-light tracking-wider text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-all uppercase"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
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
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
}