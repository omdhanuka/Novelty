import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Instagram,
  Facebook,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Shield,
  Truck,
  RefreshCw,
  CreditCard,
  ArrowRight,
  Heart,
  Award,
  Package,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-beige-200 text-navy-950 relative overflow-hidden">
      {/* Decorative wave pattern */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-gold-400 via-gold-500 to-gold-400"></div>
      
      {/* Trust Bar */}
      <div className="bg-linear-to-br from-beige-50 to-beige-100 border-b border-beige-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-300 to-amber-600 flex items-center justify-center shadow-md">
                <Truck className="text-white" size={20} />
              </div>
              <div>
                <p className="font-semibold text-navy-950 text-sm">Free Shipping</p>
                <p className="text-navy-600 text-xs">On orders ₹999+</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                <RefreshCw className="text-white" size={20} />
              </div>
              <div>
                <p className="font-semibold text-navy-950 text-sm">Easy Returns</p>
                <p className="text-navy-600 text-xs">7-day guarantee</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <p className="font-semibold text-navy-950 text-sm">Secure Payment</p>
                <p className="text-navy-600 text-xs">100% protected</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md">
                <Award className="text-white" size={20} />
              </div>
              <div>
                <p className="font-semibold text-navy-950 text-sm">Premium Quality</p>
                <p className="text-navy-600 text-xs">Handpicked bags</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="relative bg-linear-to-br from-navy-950 via-navy-900 to-navy-950 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full mb-4">
                <Mail className="text-gold-400" size={16} />
                <span className="text-gold-300 text-sm font-semibold">Newsletter</span>
              </div>
              <h3 className="font-heading text-3xl md:text-4xl mb-3 text-black">
                Join 5,000+ Happy Customers
              </h3>
              <p className="text-black/70 text-lg">
                Get exclusive deals, new arrivals & style inspiration delivered weekly
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-black text-black placeholder:text-black/50 focus:outline-none focus:border-gold-400 focus:bg-white/15 transition-all"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black rounded-full font-semibold flex items-center justify-center gap-2 transition-all hover:gap-3 shadow-lg hover:shadow-xl">
                Subscribe
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6 group">
              <h2 className="font-heading text-4xl text-navy-950 group-hover:text-gold-600 transition-colors">
                Bagvo
              </h2>
            </Link>
            <p className="text-navy-600 leading-relaxed mb-6">
              Premium bags for every journey. From boardrooms to ballrooms, we craft confidence you can carry.
            </p>
            
            {/* Social Media */}
            <div className="space-y-3 mb-6">
              <p className="text-sm font-semibold text-navy-700 uppercase tracking-wider">Follow Us</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/bagvo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://facebook.com/bagvo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                >
                  <Facebook size={20} />
                </a>
              </div>
              </div>
  
              {/* Business Credentials */}
              <div className="space-y-2 text-sm text-navy-600">
                <p className="flex items-center gap-2">
                  <Shield size={14} className="text-gold-500" />
                  <span>GST: 07AABCU9603R1ZX</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={14} className="text-gold-500" />
                  <span>Raipur, Chhattisgarh</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-base">🇮🇳</span>
                  <span className="font-semibold text-navy-700">Made in India</span>
                </p>
              </div>
            </div>
  
            {/* Shop */}
            <div>
              <h3 className="font-heading text-xl mb-6 text-navy-950 flex items-center gap-2">
                <Package size={20} className="text-gold-500" />
                Shop
              </h3>
            <ul className="space-y-3">
              {[
                'Travel Bags',
                'Ladies Handbags', 
                'Wedding Collection',
                'Office Bags',
                'Covers',
                'All Products'
              ].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/category/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-navy-600 hover:text-gold-600 hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-navy-300 group-hover:bg-gold-500 transition-colors"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-heading text-xl mb-6 text-navy-950 flex items-center gap-2">
              <Shield size={20} className="text-gold-500" />
              Help
            </h3>
            <ul className="space-y-3">
              {[
                'Track Order',
                'Shipping Info',
                'Returns & Exchange',
                'FAQs',
                'Size Guide',
                'Contact Us'
              ].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-navy-600 hover:text-gold-600 hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-navy-300 group-hover:bg-gold-500 transition-colors"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-xl mb-6 text-navy-950 flex items-center gap-2">
              <Phone size={20} className="text-gold-500" />
              Connect
            </h3>
            
            <div className="space-y-4 mb-6">
              <a 
                href="tel:+919876543210" 
                className="flex items-start gap-3 text-navy-600 hover:text-gold-600 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-beige-100 flex items-center justify-center group-hover:bg-gold-100 transition-colors flex-shrink-0">
                  <Phone size={18} className="text-navy-700" />
                </div>
                <div>
                  <p className="text-xs text-navy-500 mb-0.5">Call us</p>
                  <p className="font-semibold text-sm">+91 98765 43210</p>
                </div>
              </a>
              
              <a 
                href="mailto:hello@bagvo.com" 
                className="flex items-start gap-3 text-navy-600 hover:text-gold-600 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-beige-100 flex items-center justify-center group-hover:bg-gold-100 transition-colors flex-shrink-0">
                  <Mail size={18} className="text-navy-700" />
                </div>
                <div>
                  <p className="text-xs text-navy-500 mb-0.5">Email</p>
                  <p className="font-semibold text-sm">hello@bagvo.com</p>
                </div>
              </a>
            </div>

            {/* WhatsApp CTA */}
            <motion.a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </motion.a>
          </div>
        </div>

        {/* Payment & Security */}
        <div className="border-t border-beige-200 pt-8 pb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-navy-500 mb-2 uppercase tracking-wider font-semibold">We Accept</p>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-2 bg-linear-to-br from-navy-900 to-navy-950 rounded-lg shadow-sm">
                    <CreditCard size={20} className="text-black" />
                  </div>
                  <span className="text-navy-700 text-sm font-medium">Visa • Mastercard • UPI • Paytm • COD</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
              <Shield size={18} className="text-green-600" />
              <span className="text-green-700 text-sm font-semibold">256-bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-navy-950 text-black">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-black">
              © {currentYear} Bagvo. Crafted with <Heart size={14} className="inline text-red-400 mx-1" fill="currentColor" /> in India. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-black hover:text-gold-400 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-white/30">•</span>
              <Link to="/terms" className="text-black hover:text-gold-400 transition-colors">
                Terms & Conditions
              </Link>
              <span className="text-white/30">•</span>
              <Link to="/shipping" className="text-black hover:text-gold-400 transition-colors">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;