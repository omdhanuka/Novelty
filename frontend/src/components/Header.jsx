import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  LogOut,
  UserCircle,
  Package,
  MapPin,
  Lock,
} from 'lucide-react';
import { useCartStore, useWishlistStore, useUIStore } from '../store';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/useCart';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, toggleCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  
  const cartItemCount = cartCount || 0;

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

  const navLinks = [
    { name: 'Shop All', path: '/products' },
    { name: 'Travel Bags', path: '/products?category=travel-bags' },
    { name: 'Ladies Bags', path: '/products?category=ladies-bags' },
    { name: 'Wedding Collection', path: '/products?category=wedding-collection' },
    { name: 'Covers', path: '/products?category=covers' },
  ];

  const isActiveLink = (path) => {
    if (path === '/products') {
      return location.pathname === '/products' && !location.search;
    }
    return location.pathname === '/products' && location.search.includes(path.split('=')[1]);
  };

  return (
    <>
      {/* Premium Navbar - Light Gray Background */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'shadow-sm backdrop-blur-sm bg-[#F3F4F6]/98'
            : 'bg-[#F3F4F6] border-b border-[#E5E7EB]'
        }`}
        style={{ height: '76px' }}
      >
        <div className="max-w-[1440px] mx-auto px-12 h-full">
          <div className="flex items-center justify-between h-full gap-12">
            
            {/* Left: Brand Logo */}
            <Link 
              to="/" 
              className="flex-shrink-0 hover:opacity-80 transition-opacity duration-200"
            >
              <h1 
                className="text-[#111827]" 
                style={{ 
                  fontFamily: 'Playfair Display, serif', 
                  fontSize: '30px', 
                  fontWeight: 700,
                  letterSpacing: '-0.5px'
                }}
              >
                Bagvo
              </h1>
            </Link>

            {/* Center: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-10 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-[#111827] hover:text-[#6D28D9] transition-colors duration-200 group ${
                    isActiveLink(link.path) ? 'text-[#6D28D9]' : ''
                  }`}
                  style={{ 
                    fontFamily: 'Inter, sans-serif', 
                    fontSize: '15px', 
                    fontWeight: 500,
                    letterSpacing: '0.3px'
                  }}
                >
                  {link.name}
                  <span 
                    className={`absolute left-0 bottom-[-8px] h-[2px] bg-[#6D28D9] transition-all duration-200 ${
                      isActiveLink(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                className="hidden md:block p-2 hover:bg-white/80 rounded-lg transition-all duration-200"
                onClick={() => {/* Add search modal handler */}}
              >
                <Search size={20} className="text-[#111827]" />
              </button>

              {/* Account */}
              <div className="relative">
                {isAuthenticated ? (
                  <>
                    <button
                      className="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-white/80 rounded-lg transition-all duration-200"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <User size={20} className="text-[#111827]" />
                      <span className="text-[15px] font-medium text-[#111827]">Account</span>
                    </button>
                    
                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-2 z-50">
                        <div className="px-4 py-2 border-b border-[#E5E7EB]">
                          <p className="text-sm font-medium text-[#111827]">{user?.name}</p>
                          <p className="text-xs text-[#6B7280] truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#111827] hover:bg-[#F9FAFB]"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UserCircle size={16} />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#111827] hover:bg-[#F9FAFB]"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package size={16} />
                          My Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#111827] hover:bg-[#F9FAFB]"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Heart size={16} />
                          My Wishlist
                        </Link>
                        <Link
                          to="/addresses"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#111827] hover:bg-[#F9FAFB]"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <MapPin size={16} />
                          My Addresses
                        </Link>
                        <Link
                          to="/change-password"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#111827] hover:bg-[#F9FAFB]"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Lock size={16} />
                          Change Password
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                            navigate('/');
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#DC2626] hover:bg-red-50 border-t border-[#E5E7EB] mt-2"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      className="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-white/80 rounded-lg transition-all duration-200"
                      onClick={() => navigate('/login')}
                    >
                      <User size={20} className="text-[#111827]" />
                      <span className="text-[15px] font-medium text-[#111827]">Login</span>
                    </button>
                  </>
                )}
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative hidden md:block">
                <button className="p-2 hover:bg-white/80 rounded-lg transition-all duration-200">
                  <Heart size={20} className="text-[#111827]" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#6D28D9] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>
              </Link>

              {/* Cart */}
              <Link to="/cart">
                <button
                  className="relative p-2 hover:bg-white/80 rounded-lg transition-all duration-200"
                >
                  <ShoppingCart size={20} className="text-[#111827]" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#6D28D9] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* Mobile Menu */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 hover:bg-white/80 rounded-lg transition-all duration-200"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleMobileMenu}
            />
            
            {/* Slide-in Panel */}
            <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto animate-slide-in-right">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#E5E7EB]">
                  <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#111827]">Menu</h2>
                  <button 
                    onClick={toggleMobileMenu}
                    className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
                  >
                    <X size={24} className="text-[#111827]" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1 mb-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={toggleMobileMenu}
                      className={`block px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                        isActiveLink(link.path)
                          ? 'bg-[#6D28D9] text-white'
                          : 'text-[#111827] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                {/* User Account Section */}
                <div className="pt-6 border-t border-[#E5E7EB]">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <div className="px-4 py-2 mb-2">
                        <p className="text-sm font-semibold text-[#111827]">{user?.name}</p>
                        <p className="text-xs text-[#6B7280] truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={toggleMobileMenu}
                        className="flex items-center gap-3 px-4 py-3 text-[15px] text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                      >
                        <UserCircle size={18} />
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={toggleMobileMenu}
                        className="flex items-center gap-3 px-4 py-3 text-[15px] text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                      >
                        <Package size={18} />
                        My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={toggleMobileMenu}
                        className="flex items-center gap-3 px-4 py-3 text-[15px] text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                      >
                        <Heart size={18} />
                        My Wishlist
                      </Link>
                      <Link
                        to="/addresses"
                        onClick={toggleMobileMenu}
                        className="flex items-center gap-3 px-4 py-3 text-[15px] text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                      >
                        <MapPin size={18} />
                        My Addresses
                      </Link>
                      <Link
                        to="/change-password"
                        onClick={toggleMobileMenu}
                        className="flex items-center gap-3 px-4 py-3 text-[15px] text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                      >
                        <Lock size={18} />
                        Change Password
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          toggleMobileMenu();
                          navigate('/');
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-[15px] text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors mt-2"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={toggleMobileMenu}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#6D28D9] text-white rounded-lg font-medium hover:bg-[#5B21B6] transition-colors"
                    >
                      <User size={18} />
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
