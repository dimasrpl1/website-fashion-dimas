'use client';

import { useState, useEffect } from 'react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Minimal Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M60 60c0-33.137 26.863-60 60-60v120c-33.137 0-60-26.863-60-60zM0 60c0 33.137 26.863 60 60 60V0C26.863 0 0 26.863 0 60z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative w-full min-h-screen flex items-center px-4 sm:px-6 lg:px-8 xl:px-12 py-20 sm:py-24 lg:py-32">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
            
            {/* Content Section - Left */}
            <div
              className={`space-y-8 sm:space-y-10 lg:space-y-12 order-2 lg:order-1 transform transition-all duration-1200 ease-out ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              {/* Main Headlines */}
              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extralight leading-[0.9] tracking-tight text-gray-900">
                    ATELIER
                  </h1>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-600 tracking-[0.2em] leading-tight">
                    COUTURE
                  </h2>
                  <div className="w-16 sm:w-20 lg:w-24 h-px bg-gradient-to-r from-gray-900 via-gray-600 to-transparent mt-6 sm:mt-8"></div>
                </div>
                
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-light leading-relaxed max-w-lg tracking-wide">
                  Where Indonesian heritage meets contemporary luxury. 
                  <span className="block mt-2 text-sm sm:text-base text-gray-500">
                    Handcrafted excellence since 1960
                  </span>
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 sm:pt-6">
                <a
                  href="#products"
                  className="group relative inline-flex items-center justify-center px-8 sm:px-10 lg:px-12 py-3 sm:py-4 text-sm sm:text-base font-light tracking-[0.2em] text-white bg-gray-900 hover:bg-gray-800 transition-all duration-500 ease-out overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    DISCOVER
                    <svg className="ml-3 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </a>

                <a
                  href="#about"
                  className="group relative inline-flex items-center justify-center px-8 sm:px-10 lg:px-12 py-3 sm:py-4 text-sm sm:text-base font-light tracking-[0.2em] text-gray-900 bg-transparent border border-gray-300 hover:border-gray-900 transition-all duration-500 ease-out overflow-hidden"
                >
                  <span className="relative z-10">OUR HERITAGE</span>
                  <div className="absolute inset-0 bg-gray-50 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                </a>
              </div>

              
            </div>

            {/* Image Section - Right */}
            <div
              className={`relative order-1 lg:order-2 transform transition-all duration-1400 ease-out delay-300 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              }`}
            >
              <div className="relative">
                {/* Main Image Container */}
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src="/image/image3.jpg"
                    alt="Atelier Couture Collection"
                    className="w-full h-[500px] sm:h-[600px] lg:h-[700px] xl:h-[800px] object-cover transition-all duration-700 hover:scale-[1.01]"
                    style={{ aspectRatio: '4/5' }}
                  />
                  
                  {/* Subtle Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                  
                  {/* Floating Badge */}
                  <div className="absolute top-6 sm:top-8 right-6 sm:right-8">
                    <div className="bg-white/90 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-light tracking-wider text-gray-900">
                      EXCLUSIVE
                    </div>
                  </div>
                </div>


                {/* Minimal Geometric Elements */}
                <div className="absolute top-1/4 -right-2 sm:-right-4">
                  <div className="w-1 h-16 sm:h-20 bg-gray-200 transform rotate-12"></div>
                </div>
                <div className="absolute bottom-1/3 -left-2 sm:-left-4">
                  <div className="w-1 h-12 sm:h-16 bg-gray-300 transform -rotate-12"></div>
                </div>

                {/* Floating Minimal Elements */}
                <div className="absolute top-16 sm:top-20 -left-6 sm:-left-8 animate-float-slow">
                  <div className="w-2 h-2 bg-gray-400 transform rotate-45"></div>
                </div>
                <div className="absolute top-1/2 -right-6 sm:-right-8 animate-float-slow" style={{ animationDelay: '2s' }}>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}