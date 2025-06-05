'use client';

import { useState, useEffect } from 'react';
// import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);
      
      // Jika scroll ke bawah dan sudah scroll lebih dari 10px, sembunyikan navbar
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setIsVisible(false);
      } 
      // Jika scroll ke atas dengan jarak minimum 50px, tampilkan navbar
      else if (currentScrollY < lastScrollY && scrollDifference > 50) {
        setIsVisible(true);
      }
      
      // Jika di bagian paling atas (scroll position 0), selalu tampilkan navbar
      if (currentScrollY === 0) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle scroll event untuk performa yang lebih baik
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          controlNavbar();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      {/* Elegant backdrop with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/98 to-white/95 backdrop-blur-xl border-b border-gray-200/50" />
      
      <div className="relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20 xl:h-22">
            
            {/* Logo Section - Refined */}
            <div className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                {/* <Image
                  src="/image/log.png"
                  alt="Logo"
                  fill
                  className="object-contain filter drop-shadow-sm group-hover:drop-shadow-md transition-all duration-500"
                  priority
                /> */}
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-gray-700">
                  ATELIER
                </span>
                <span className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base font-extralight tracking-widest text-gray-500 uppercase">
                  Collections
                </span>
              </div>
            </div>

            {/* Desktop Navigation - Minimalist */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 2xl:gap-10">
              {[
                { name: 'Home', href: '/' },
                { name: 'Collection', href: '/collection' },
                { name: 'About', href: '#about' },
                { name: 'Atelier', href: '#atelier' },
                { name: 'Contact', href: '#contact' }
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative group py-2 px-1"
                >
                  <span className="text-sm xl:text-base font-light tracking-wide text-gray-800 group-hover:text-gray-900 transition-all duration-300">
                    {item.name.toUpperCase()}
                  </span>
                  {/* Elegant underline animation */}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-gray-800 to-gray-600 transition-all duration-500 group-hover:w-full"></span>
                  {/* Subtle hover background */}
                  <span className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-50 transition-all duration-300 -z-10 scale-0 group-hover:scale-100 rounded-sm"></span>
                </Link>
              ))}
            </nav>

            {/* Desktop CTA - Sophisticated */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              <Link
                href="#contact"
                className="group relative overflow-hidden border border-gray-900 px-4 xl:px-6 py-2 xl:py-2.5 text-xs xl:text-sm font-light tracking-widest text-gray-900 hover:text-white transition-all duration-500 ease-out"
              >
                <span className="relative z-10">INQUIRE</span>
                <div className="absolute inset-0 bg-gray-900 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
              </Link>
            </div>

            {/* Mobile & Tablet Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-sm text-gray-800 hover:bg-gray-100/50 transition-all duration-300 group"
              aria-label="Toggle navigation menu"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center items-center">
                <span className={`block w-4 sm:w-5 h-px bg-gray-800 transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''
                }`}></span>
                <span className={`block w-4 sm:w-5 h-px bg-gray-800 my-1 transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}></span>
                <span className={`block w-4 sm:w-5 h-px bg-gray-800 transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''
                }`}></span>
              </div>
            </button>
          </div>

          {/* Mobile & Tablet Menu - Elegant */}
          <div className={`lg:hidden transition-all duration-700 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="relative py-4 sm:py-6">
              {/* Elegant backdrop for mobile menu */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/98 to-gray-50/95 backdrop-blur-xl border-t border-gray-200/30" />
              
              <nav className="relative space-y-1 sm:space-y-2">
                {[
                  { name: 'Home', href: '#home' },
                  { name: 'Collection', href: '/collection' },
                  { name: 'About', href: '#about' },
                  { name: 'Atelier', href: '#atelier' },
                  { name: 'Contact', href: '#contact' }
                ].map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group block px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-light tracking-wide text-gray-800 hover:text-gray-900 transition-all duration-300 relative"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="relative z-10">{item.name.toUpperCase()}</span>
                    {/* Elegant hover effect */}
                    <div className="absolute left-0 top-0 w-1 h-full bg-gray-900 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
                    <div className="absolute inset-0 bg-gray-100/30 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </Link>
                ))}
                
                {/* Mobile CTA */}
                <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                  <Link
                    href="#contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group relative overflow-hidden block w-full text-center border border-gray-900 px-4 py-3 sm:py-4 text-sm sm:text-base font-light tracking-widest text-gray-900 hover:text-white transition-all duration-500 ease-out"
                  >
                    <span className="relative z-10">INQUIRE NOW</span>
                    <div className="absolute inset-0 bg-gray-900 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}