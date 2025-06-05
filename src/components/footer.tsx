"use client";

import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Heart
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white border-t-4 border-blue-500">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-extralight tracking-[0.3em] text-white">
                ATELIER
              </h3>
              <div className="w-12 h-px bg-blue-400"></div>
              <p className="text-sm text-gray-300 font-light leading-relaxed tracking-wide">
                Crafting timeless pieces that embody elegance, quality, and contemporary style. 
                Every garment tells a story of refined taste and exceptional craftsmanship.
              </p>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-sm font-light tracking-wider text-gray-300 uppercase">
                Follow Us
              </h4>
              <div className="flex gap-4">
                <a 
                  href="https://www.instagram.com/nimpoxx/" 
                  className="group w-10 h-10 border border-gray-500 flex items-center justify-center hover:border-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300"
                >
                  <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </a>
                <a 
                  href="#" 
                  className="group w-10 h-10 border border-gray-500 flex items-center justify-center hover:border-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300"
                >
                  <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </a>
                <a 
                  href="#" 
                  className="group w-10 h-10 border border-gray-500 flex items-center justify-center hover:border-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300"
                >
                  <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Customer Care */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-light tracking-wider text-gray-300 uppercase">
                Customer Care
              </h4>
              <div className="w-8 h-px bg-blue-400"></div>
            </div>
            <nav className="space-y-3">
              {[
                "Contact Us",
                "Shipping Info",
                "Returns & Exchanges",
                "FAQ",
                "Privacy Policy",
                "Terms of Service"
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-sm text-gray-300 hover:text-blue-400 font-light tracking-wide transition-colors duration-300 hover:translate-x-1 transform"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-light tracking-wider text-gray-300 uppercase">
                Get In Touch
              </h4>
              <div className="w-8 h-px bg-blue-400"></div>
            </div>
            
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300 font-light leading-relaxed">
                  123 Fashion Street<br />
                  Simpang, West Java<br />
                  Indonesia 12345
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a 
                  href="tel:+6281234567890" 
                  className="text-sm text-gray-300 hover:text-blue-400 font-light tracking-wide transition-colors duration-300"
                >
                  +62 812-3456-7890
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a 
                  href="mailto:hello@yourbrand.com" 
                  className="text-sm text-gray-300 hover:text-blue-400 font-light tracking-wide transition-colors duration-300"
                >
                  hello@aterlier.com
                </a>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300 font-light leading-relaxed">
                  Mon - Fri: 9:00 - 18:00<br />
                  Sat - Sun: 10:00 - 16:00
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            
            {/* Copyright */}
            <div className="text-sm text-gray-300 font-light tracking-wide text-center sm:text-left">
              © 2025 ATELIER. All rights reserved.
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 font-light tracking-wider uppercase">
                We Accept
              </span>
              <div className="flex gap-2">
                {/* Payment icons placeholders */}
                <div className="w-8 h-5 bg-gray-600 rounded flex items-center justify-center border border-gray-500">
                  <span className="text-xs text-gray-300 font-bold">V</span>
                </div>
                <div className="w-8 h-5 bg-gray-600 rounded flex items-center justify-center border border-gray-500">
                  <span className="text-xs text-gray-300 font-bold">M</span>
                </div>
                <div className="w-8 h-5 bg-gray-600 rounded flex items-center justify-center border border-gray-500">
                  <span className="text-xs text-gray-300 font-bold">PP</span>
                </div>
              </div>
            </div>

            {/* Made with love */}
            <div className="flex items-center gap-2 text-sm text-gray-300 font-light">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>in Indonesia</span>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}