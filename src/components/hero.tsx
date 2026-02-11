'use client';

import { useState, useEffect } from 'react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [, setMousePosition] = useState({ x: 0, y: 0 });
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-stone-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative w-full min-h-screen flex items-center px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-20 py-16 sm:py-20 lg:py-24 xl:py-32">
        <div className="w-full max-w-8xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 items-center">
            
            {/* Content Section - Left */}
            <div className="lg:col-span-5 xl:col-span-6 order-2 lg:order-1">
              <div
                className={`space-y-6 sm:space-y-8 lg:space-y-10 transform transition-all duration-1200 ease-out ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                }`}
              >


                {/* Main Headlines */}
                <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                  <div className="space-y-4 sm:space-y-6">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extralight leading-[0.85] tracking-tight text-stone-900 hover:text-stone-700 transition-colors duration-700 cursor-default">
                      <span className="block opacity-0 animate-slide-up" style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
                        TIMELESS
                      </span>
                      <span className="block opacity-0 animate-slide-up" style={{animationDelay: '0.6s', animationFillMode: 'forwards'}}>
                        ELEGANCE
                      </span>
                    </h1>
                    
                    <div className="w-12 sm:w-16 lg:w-20 xl:w-24 h-px bg-gradient-to-r from-stone-900 via-stone-600 to-transparent transform origin-left scale-x-0 animate-line-grow"></div>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6 opacity-0 animate-fade-in-up" style={{animationDelay: '1.5s', animationFillMode: 'forwards'}}>
                    <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-light text-stone-700 leading-relaxed max-w-2xl tracking-wide">
                      Where <em className="not-italic font-normal text-stone-900">artisanal mastery</em> meets 
                      <span className="block sm:inline"> contemporary sophistication</span>
                    </p>
                    
                    <p className="text-sm sm:text-base lg:text-lg text-stone-600 font-light leading-relaxed max-w-xl tracking-wide">
                      Each piece tells a story of meticulous craftsmanship, 
                      <span className="block mt-1">celebrating the finest traditions of Indonesian heritage.</span>
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 sm:pt-6 opacity-0 animate-fade-in-up" style={{animationDelay: '1.8s', animationFillMode: 'forwards'}}>
                  <a
                    href="/collection"
                    className="group relative inline-flex items-center justify-center px-8 sm:px-10 lg:px-12 xl:px-14 py-4 sm:py-5 text-sm sm:text-base lg:text-lg font-light tracking-[0.15em] text-white bg-stone-900 hover:bg-stone-800 transition-all duration-500 ease-out overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    <span className="relative z-10 flex items-center">
                      EXPLORE COLLECTIONS
                      <svg className="ml-3 w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </a>

                </div>


              </div>
            </div>

            {/* Image Section - Right */}
            <div className="lg:col-span-7 xl:col-span-6 order-1 lg:order-2">
              <div
                className={`relative transform transition-all duration-1500 ease-out delay-300 ${
                  isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
                }`}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
              >
                <div className="relative group cursor-pointer">
                  {/* Decorative Frame */}
                  
                  
                  {/* Main Image Container - Adjusted to match image aspect ratio */}
                  <div className="relative overflow-hidden rounded-xl shadow-2xl"
                    style={{ backgroundColor: '#f8f9f4' }}
                  >
                    <img
                      src="/image/image3.jpg"
                      alt="Elegant Couture Collection"
                      className="w-full h-auto object-contain transition-all duration-700 max-h-[500px] sm:max-h-[600px] md:max-h-[650px] lg:max-h-[700px] xl:max-h-[750px] 2xl:max-h-[800px]"
                      style={{ 
                        aspectRatio: '1800/2600' // Using the actual image aspect ratio
                      }}
                    />
                    
                    {/* Dynamic Overlay */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-stone-900/10 transition-opacity duration-700 ${
                        isImageHovered ? 'opacity-0' : 'opacity-100'
                      }`}
                    ></div>
                    


                    {/* Made by NiMpo Badge */}
                    <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-6 sm:left-8 lg:left-10 transition-all duration-500">
                      <div className={`bg-stone-900/95 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-light tracking-wider text-white shadow-lg rounded-full transition-transform duration-300 ${isImageHovered ? 'scale-110' : 'scale-100'}`}>
                        MADE BY NIMPO
                      </div>
                    </div>

                    {/* Elegant Accent Lines */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000"></div>
                    <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-amber-400 via-rose-400 to-transparent transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-1000 delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes line-grow {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        .animate-line-grow {
          animation: line-grow 1s ease-out 0.9s forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        /* Responsive text scaling */
        @media (max-width: 640px) {
          h1 {
            font-size: clamp(2.5rem, 8vw, 4rem);
          }
        }

        @media (min-width: 2560px) {
          .max-w-8xl {
            max-width: 100rem;
          }
        }
      `}</style>
    </section>
  );
}