'use client';

import { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle
} from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');
    
    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Subject: ${formData.subject}\n\n` +
        `Message:\n${formData.message}`
      );
      
      const mailtoLink = `mailto:muhdimassusanto12@gmail.com?subject=${subject}&body=${body}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Reset form after a short delay
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setSubmitStatus('success');
        setIsSubmitting(false);
      }, 1000);
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  const whatsappLink = `https://wa.me/6281234567890?text=Hello,%20I'm%20interested%20in%20learning%20more%20about%20ATELIER.`;

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-geist-sans)]">
      <Navbar />

      {/* Main Content */}
      <section className="pt-24 py-16 lg:py-34">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
            
            {/* Contact Information */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-2xl lg:text-3xl font-light tracking-[0.2em] text-gray-900 uppercase">
                  Get in Touch
                </h2>
                <div className="w-16 h-px bg-gray-900"></div>
                <p className="text-gray-600 font-light leading-relaxed text-lg">
                  Whether you have questions about our collections, need styling advice, 
                  or want to discuss custom pieces, we&apos;re here to help.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-8">
                
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium tracking-wider text-gray-900 uppercase">
                      Visit Our Atelier
                    </h3>
                    <div className="text-gray-600 font-light leading-relaxed">
                      Jl. Raya Bandung No. 123<br />
                      Bandung, West Java<br />
                      Indonesia 40111
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium tracking-wider text-gray-900 uppercase">
                      Call Us
                    </h3>
                    <a 
                      href="tel:+6281234567890"
                      className="text-gray-600 hover:text-gray-900 font-light transition-colors duration-300"
                    >
                      +62 812-3456-7890
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium tracking-wider text-gray-900 uppercase">
                      Email Us
                    </h3>
                    <a 
                      href="mailto:muhdimassusanto12@gmail.com"
                      className="text-gray-600 hover:text-gray-900 font-light transition-colors duration-300"
                    >
                      muhdimassusanto12@gmail.com
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium tracking-wider text-gray-900 uppercase">
                      Business Hours
                    </h3>
                    <div className="text-gray-600 font-light leading-relaxed">
                      Monday - Friday: 9:00 - 18:00<br />
                      Saturday - Sunday: 10:00 - 16:00
                    </div>
                  </div>
                </div>

              </div>

              {/* WhatsApp CTA */}
              <div className="bg-gray-50 p-6 lg:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Quick Response via WhatsApp
                  </h3>
                </div>
                <p className="text-gray-600 font-light">
                  For immediate assistance and faster response time, 
                  message us directly on WhatsApp.
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Social Media */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium tracking-wider text-gray-900 uppercase">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <a 
                    href="https://www.instagram.com/nimpoxx/" 
                    className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors duration-300"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors duration-300"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors duration-300"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl lg:text-3xl font-light tracking-[0.2em] text-gray-900 uppercase">
                  Send Message
                </h2>
                <div className="w-16 h-px bg-gray-900"></div>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-light">
                    Thank you! Your email client should have opened. If not, please send an email directly to muhdimassusanto12@gmail.com
                  </p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-light">
                    Something went wrong. Please try again or email us directly at muhdimassusanto12@gmail.com
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name */}
                <div className="space-y-2">
                  <label 
                    htmlFor="name" 
                    className="block text-sm font-medium tracking-wider text-gray-900 uppercase"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors duration-300 font-light"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium tracking-wider text-gray-900 uppercase"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors duration-300 font-light"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label 
                    htmlFor="subject" 
                    className="block text-sm font-medium tracking-wider text-gray-900 uppercase"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors duration-300 font-light"
                    placeholder="What is this regarding?"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label 
                    htmlFor="message" 
                    className="block text-sm font-medium tracking-wider text-gray-900 uppercase"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors duration-300 font-light resize-vertical"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-medium tracking-[0.1em] uppercase hover:bg-gray-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-2xl lg:text-3xl font-light tracking-[0.2em] text-gray-900 uppercase">
              Find Us
            </h2>
            <div className="w-16 h-px bg-gray-900 mx-auto"></div>
          </div>
          
          {/* Google Maps Embed */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.26256446168!2d107.57311434277344!3d-6.903444399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20Bandung%20City%2C%20West%20Java%2C%20Indonesia!5e0!3m2!1sen!2sus!4v1647123456789!5m2!1sen!2sus"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location in Bandung, West Java"
              className="w-full h-64 lg:h-96"
            ></iframe>
          </div>
          
          {/* Location Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 font-light mb-4">
              Visit us at our atelier in the heart of Bandung, West Java
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://maps.google.com/?q=Bandung,+West+Java,+Indonesia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors duration-300"
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </a>
              <a
                href="https://maps.google.com/?q=Bandung,+West+Java,+Indonesia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 font-light transition-colors duration-300"
              >
                View on Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}