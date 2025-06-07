"use client";

import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  Clock
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl lg:text-3xl font-light tracking-[0.4em] text-white">
                ATELIER
              </h3>
              <p className="text-gray-400 font-light leading-relaxed max-w-md">
                Crafting timeless pieces that embody elegance, quality, and contemporary style. 
                Every garment tells a story of refined taste and exceptional craftsmanship.
              </p>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium tracking-wider text-white uppercase">
                Connect
              </h4>
              <div className="flex gap-4">
                <a 
                  href="https://www.instagram.com/nimpoxx/" 
                  className="group w-12 h-12 bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="group w-12 h-12 bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="group w-12 h-12 bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Customer Care */}
          <div className="space-y-6">
            <h4 className="text-sm font-medium tracking-wider text-white uppercase">
              Customer Care
            </h4>
            <nav className="space-y-3">
              {[
                "Contact Us",
                "Shipping Info",
                "Size Guide",
                "Returns",
                "FAQ",
                "Track Order"
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-sm text-gray-400 hover:text-white font-light transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h4 className="text-sm font-medium tracking-wider text-white uppercase">
              Company
            </h4>
            <nav className="space-y-3">
              {[
                "About Us",
                "Careers",
                "Press",
                "Sustainability",
                "Privacy Policy",
                "Terms of Use"
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-sm text-gray-400 hover:text-white font-light transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

        </div>

        {/* Contact Info Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Address */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium tracking-wider text-white uppercase">
                Visit Us
              </h4>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-400 font-light leading-relaxed">
                  123 Fashion Street<br />
                  Simpang, West Java<br />
                  Indonesia 12345
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium tracking-wider text-white uppercase">
                Contact
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <a 
                    href="tel:+6281234567890" 
                    className="text-sm text-gray-400 hover:text-white font-light transition-colors duration-300"
                  >
                    +62 812-3456-7890
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <a 
                    href="mailto:hello@atelier.com" 
                    className="text-sm text-gray-400 hover:text-white font-light transition-colors duration-300"
                  >
                    hello@atelier.com
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium tracking-wider text-white uppercase">
                Hours
              </h4>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-400 font-light leading-relaxed">
                  Mon - Fri: 9:00 - 18:00<br />
                  Sat - Sun: 10:00 - 16:00
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <div className="text-sm text-gray-400 font-light">
              © 2025 ATELIER. All rights reserved.
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-6">
              <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">
                We Accept
              </span>
              <div className="flex gap-2">
                {/* Payment icons - Clean minimal style */}
                <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-xs text-black font-bold">VISA</span>
                </div>
                <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-xs text-black font-bold">MC</span>
                </div>
                <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-xs text-black font-bold">PP</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="text-sm text-gray-400 font-light">
              Made in Indonesia
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}