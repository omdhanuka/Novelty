import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
  ShoppingBag,
  CreditCard,
  Shield,
  Truck,
  Heart,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Stay Updated!
              </h3>
              <p className="text-slate-300 text-lg">
                Subscribe to get exclusive offers, early access to new arrivals, and exciting deals delivered to your inbox.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex gap-3"
            >
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all text-white placeholder-slate-400"
                />
              </div>
              <motion.button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={20} />
                Subscribe
              </motion.button>
            </motion.form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6 group">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-xl">
                  <ShoppingBag className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    BagShop
                  </div>
                  <div className="text-xs text-amber-400 tracking-wider uppercase">Premium Collection</div>
                </div>
              </Link>
              
              <p className="text-slate-400 leading-relaxed mb-6">
                Your trusted destination for premium quality bags, purses, and covers. From travel essentials to wedding collections, we bring you the finest products at the best prices.
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="text-green-400" size={16} />
                  </div>
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Truck className="text-blue-400" size={16} />
                  </div>
                  <span>Fast Delivery</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: 'https://facebook.com', color: 'from-blue-600 to-blue-700' },
                  { icon: Instagram, href: 'https://instagram.com', color: 'from-pink-600 to-purple-600' },
                  { icon: Twitter, href: 'https://twitter.com', color: 'from-blue-400 to-blue-500' },
                  { icon: Youtube, href: 'https://youtube.com', color: 'from-red-600 to-red-700' },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg`}
                    whileHover={{ y: -3 }}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Shop</h4>
              <ul className="space-y-3">
                {[
                  { name: 'All Products', to: '/products' },
                  { name: 'Travel Bags', to: '/category/travel' },
                  { name: 'Ladies Bags', to: '/category/ladies' },
                  { name: 'Wedding Collection', to: '/category/wedding' },
                  { name: 'Best Sellers', to: '/bestsellers' },
                  { name: 'Special Offers', to: '/offers' },
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to} 
                      className="text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Customer Care</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Track Order', to: '/track' },
                  { name: 'Shipping Info', to: '/shipping' },
                  { name: 'Returns', to: '/returns' },
                  { name: 'Size Guide', to: '/size-guide' },
                  { name: 'FAQs', to: '/faq' },
                  { name: 'Contact Us', to: '/contact' },
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to} 
                      className="text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Get In Touch</h4>
              <ul className="space-y-4">
                <li>
                  <a 
                    href="tel:+919876543210" 
                    className="flex items-start gap-3 text-slate-400 hover:text-amber-400 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition-colors flex-shrink-0">
                      <Phone size={18} className="text-amber-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">+91 98765 43210</div>
                      <div className="text-sm text-slate-500">Mon-Sat, 10 AM - 7 PM</div>
                    </div>
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:support@bagshop.com" 
                    className="flex items-start gap-3 text-slate-400 hover:text-amber-400 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition-colors flex-shrink-0">
                      <Mail size={18} className="text-amber-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white break-all">support@bagshop.com</div>
                      <div className="text-sm text-slate-500">24/7 Email Support</div>
                    </div>
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-3 text-slate-400">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-amber-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">Visit Store</div>
                      <div className="text-sm text-slate-500 mb-2">
                        123 Shopping Street,<br />
                        Market Area, City - 110001
                      </div>
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300 text-sm font-semibold inline-flex items-center gap-1"
                      >
                        Get Directions →
                      </a>
                    </div>
                  </div>
                </li>
              </ul>

              {/* WhatsApp Button */}
              <motion.a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="relative border-t border-slate-700/50 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-slate-400 text-sm mb-3 text-center md:text-left">We Accept</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {['Visa', 'Mastercard', 'RuPay', 'UPI', 'Paytm', 'COD'].map((method, index) => (
                  <div 
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-white/20 transition-colors"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-lg">
                <Shield className="text-green-400" size={20} />
                <span className="text-sm font-semibold text-green-400">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-lg">
                <CreditCard className="text-blue-400" size={20} />
                <span className="text-sm font-semibold text-blue-400">SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-slate-700/50 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-slate-400">
              © {currentYear} <span className="text-white font-semibold">BagShop</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <span>Crafted with</span>
              <Heart className="text-red-500 fill-red-500 animate-pulse" size={16} />
              <span>in India</span>
            </div>
            <div className="flex gap-6 text-slate-400">
              <Link to="/privacy" className="hover:text-amber-400 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-amber-400 transition-colors">Terms</Link>
              <Link to="/sitemap" className="hover:text-amber-400 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
