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
  LogOut,
  UserCircle,
} from 'lucide-react';
import { useCartStore, useWishlistStore, useUIStore } from '../store';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMegaMenu, setShowMegaMenu] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const navigate = useNavigate();
  const { items: cartItems, toggleCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const { user, isAuthenticated, logout } = useAuth();
  
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
      {/* Main Header - Minimal & Sticky */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-md shadow-sm border-b border-navy-100'
            : 'bg-white'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between gap-8">
            {/* Logo - Bagvo Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <h1 className="font-heading text-3xl md:text-4xl text-navy-950 tracking-tight">
                  Bagvo
                </h1>
              </motion.div>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {categories.map((category) => (
                <div
                  key={category.slug}
                  className="relative group"
                  onMouseEnter={() => setShowMegaMenu(category.slug)}
                  onMouseLeave={() => setShowMegaMenu(null)}
                >
                  <Link
                    to={`/category/${category.slug}`}
                    className="relative px-4 py-2 text-navy-700 hover:text-navy-950 font-medium transition-colors duration-300 group"
                  >
                    {category.name}
                    {/* Animated underline */}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:block p-2.5 hover:bg-navy-50 rounded-full transition-colors duration-300"
                onClick={() => {/* Add search modal handler */}}
              >
                <Search size={20} className="text-navy-700" />
              </motion.button>

              {/* Account */}
              <div className="relative">
                {isAuthenticated ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden md:block p-2.5 hover:bg-navy-50 rounded-full transition-colors duration-300"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <User size={20} className="text-navy-700" />
                    </motion.button>
                    
                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/account"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UserCircle size={16} />
                          My Account
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UserCircle size={16} />
                          My Profile
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                            navigate('/');
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-navy-50 rounded-lg transition-colors duration-300"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <User size={20} className="text-navy-700" />
                      <span className="text-sm font-medium text-navy-700">Login</span>
                    </motion.button>
                    
                    {/* Login Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <Link
                          to="/login"
                          className="block px-4 py-3 text-sm text-navy-700 hover:bg-navy-50 font-medium"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Login
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 hover:bg-navy-50 rounded-full transition-colors duration-300"
                >
                  <Heart size={20} className="text-navy-700" />
                  {wishlistItems.length > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-gold-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      {wishlistItems.length}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className="relative p-2.5 hover:bg-navy-50 rounded-full transition-colors duration-300"
              >
                <ShoppingCart size={20} className="text-navy-700" />
                {cartItemCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-navy-950 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Mobile Menu */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2.5 hover:bg-navy-50 rounded-full transition-colors duration-300"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu - appears on hover */}
        <AnimatePresence>
          {showMegaMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-white border-t border-navy-100 shadow-lg"
              onMouseEnter={() => setShowMegaMenu(showMegaMenu)}
              onMouseLeave={() => setShowMegaMenu(null)}
            >
              <div className="max-w-7xl mx-auto px-6 py-8">
                {categories.find(cat => cat.slug === showMegaMenu)?.subcategories && (
                  <div className="grid grid-cols-4 gap-6">
                    {categories.find(cat => cat.slug === showMegaMenu).subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        to={`/category/${showMegaMenu}/${sub.slug}`}
                        className="group p-4 hover:bg-beige-100 rounded-lg transition-colors duration-300"
                      >
                        <h4 className="font-semibold text-navy-900 group-hover:text-gold-600 transition-colors">
                          {sub.name}
                        </h4>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
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
                  <h2 className="text-xl font-heading font-bold">Menu</h2>
                  <button onClick={toggleMobileMenu} className="p-2">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.slug} className="border-b border-navy-200 pb-4">
                      <Link
                        to={`/category/${category.slug}`}
                        className="font-semibold text-navy-900 block mb-2"
                        onClick={toggleMobileMenu}
                      >
                        {category.name}
                      </Link>
                      <ul className="pl-4 space-y-2">
                        {category.subcategories.map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              to={`/category/${category.slug}/${sub.slug}`}
                              className="text-navy-600 hover:text-gold-600 transition"
                              onClick={toggleMobileMenu}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
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
