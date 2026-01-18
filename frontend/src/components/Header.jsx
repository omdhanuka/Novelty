import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Phone,
  MapPin,
} from 'lucide-react';
import { useCartStore, useWishlistStore, useUIStore } from '../store';
import MegaMenu from './MegaMenu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMegaMenu, setShowMegaMenu] = useState(null);
  
  const navigate = useNavigate();
  const { items: cartItems, toggleCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const categories = [
    {
      name: 'Travel Bags',
      slug: 'travel-bags',
      subcategories: [
        { name: 'Trolley Bags', slug: 'trolley-bags' },
        { name: 'Duffel Bags', slug: 'duffel-bags' },
        { name: 'Trekking Bags', slug: 'trekking-bags' },
        { name: 'Travel Pouches', slug: 'travel-pouches' },
      ],
    },
    {
      name: 'Ladies Bags',
      slug: 'ladies-bags',
      subcategories: [
        { name: 'Handbags', slug: 'handbags' },
        { name: 'Sling Bags', slug: 'sling-bags' },
        { name: 'Side Purses', slug: 'side-purses' },
        { name: 'Wallets', slug: 'wallets' },
      ],
    },
    {
      name: 'Wedding Collection',
      slug: 'wedding-collection',
      subcategories: [
        { name: 'Dulhan Purses', slug: 'dulhan-purses' },
        { name: 'Hand Purses', slug: 'hand-purses' },
        { name: 'Cosmetic Bags', slug: 'cosmetic-bags' },
        { name: 'Gift Pouches', slug: 'gift-pouches' },
      ],
    },
    {
      name: 'Covers',
      slug: 'covers',
      subcategories: [
        { name: 'Saree Covers', slug: 'saree-covers' },
        { name: 'Suit Covers', slug: 'suit-covers' },
        { name: 'Garment Covers', slug: 'garment-covers' },
      ],
    },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-2.5 hidden md:block border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-amber-400 transition-colors duration-300">
                <Phone size={14} />
                <span>+91 98765 43210</span>
              </a>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-400 transition-colors duration-300">
                <MapPin size={14} />
                <span>Visit Our Store</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-semibold">✨ Free Shipping on Orders Above ₹999</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">Easy Returns Within 7 Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${
          isScrolled
            ? 'bg-white/95 shadow-xl border-b border-slate-200'
            : 'bg-white shadow-lg'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">B</span>
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                    BagShop
                  </div>
                  <div className="text-[10px] text-slate-500 tracking-wider uppercase -mt-1">Premium Collection</div>
                </div>
              </motion.div>
            </Link>

            {/* Search Bar - Desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-2xl mx-8"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bags, purses, covers..."
                  className="w-full px-6 py-3.5 pl-12 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 bg-slate-50/50 hover:bg-white"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2.5 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile Search */}
              <button className="md:hidden p-2 hover:bg-secondary-100 rounded-full transition">
                <Search size={22} />
              </button>

              {/* Account */}
              <Link
                to="/account"
                className="hidden md:flex items-center gap-2 p-2.5 hover:bg-slate-100 rounded-xl transition-colors duration-300"
              >
                <User size={22} className="text-slate-700" />
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-colors duration-300"
              >
                <Heart size={22} />
                {wishlistItems.length > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    {wishlistItems.length}
                  </motion.span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-colors duration-300"
              >
                <ShoppingCart size={22} className="text-slate-700" />
                {cartItemCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 hover:bg-secondary-100 rounded-full transition"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:block border-t border-secondary-200">
          <div className="container-custom">
            <ul className="flex items-center justify-center gap-8 py-3">
              {categories.map((category) => (
                <li
                  key={category.slug}
                  className="relative"
                  onMouseEnter={() => setShowMegaMenu(category.slug)}
                  onMouseLeave={() => setShowMegaMenu(null)}
                >
                  <Link
                    to={`/category/${category.slug}`}
                    className="flex items-center gap-1 font-semibold text-secondary-700 hover:text-primary-600 transition py-2"
                  >
                    {category.name}
                    <ChevronDown size={16} />
                  </Link>
                  
                  <AnimatePresence>
                    {showMegaMenu === category.slug && (
                      <MegaMenu category={category} />
                    )}
                  </AnimatePresence>
                </li>
              ))}
              <li>
                <Link
                  to="/offers"
                  className="font-semibold text-primary-600 hover:text-primary-700 transition"
                >
                  🔥 Offers
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={toggleMobileMenu} />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-display font-bold">Menu</h2>
                  <button onClick={toggleMobileMenu} className="p-2">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.slug} className="border-b border-secondary-200 pb-4">
                      <Link
                        to={`/category/${category.slug}`}
                        className="font-semibold text-secondary-900 block mb-2"
                        onClick={toggleMobileMenu}
                      >
                        {category.name}
                      </Link>
                      <ul className="pl-4 space-y-2">
                        {category.subcategories.map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              to={`/category/${category.slug}/${sub.slug}`}
                              className="text-secondary-600 hover:text-primary-600 transition"
                              onClick={toggleMobileMenu}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  
                  <Link
                    to="/offers"
                    className="block font-semibold text-primary-600"
                    onClick={toggleMobileMenu}
                  >
                    🔥 Special Offers
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
