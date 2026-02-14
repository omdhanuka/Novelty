import { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Filter, Grid, List, ChevronDown, Search, X, ShoppingCart, User, Home, LogOut, Package, Heart, MapPin, Lock } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from '../../components/FilterSidebar';
import { api } from '../../lib/api';
import { CartContext } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    colors: [],
    materials: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    colors: [],
    material: [],
    minPrice: 0,
    maxPrice: 10000,
    inStockOnly: false,
    discount: null,
    isBestSeller: false,
    isNewArrival: false,
  });

  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  // Fetch products - this will also update available filter options dynamically
  useEffect(() => {
    fetchProducts();
  }, [activeFilters, sortBy, pagination.page, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy,
      });

      if (searchQuery) params.append('search', searchQuery);
      if (activeFilters.category.length > 0) params.append('category', activeFilters.category.join(','));
      if (activeFilters.colors.length > 0) params.append('colors', activeFilters.colors.join(','));
      if (activeFilters.material.length > 0) params.append('material', activeFilters.material.join(','));
      if (activeFilters.minPrice > 0) params.append('minPrice', activeFilters.minPrice);
      if (activeFilters.maxPrice < 10000) params.append('maxPrice', activeFilters.maxPrice);
      if (activeFilters.discount) params.append('discount', activeFilters.discount);
      if (activeFilters.inStockOnly) params.append('stockStatus', 'in_stock');
      if (activeFilters.isBestSeller) params.append('isBestSeller', 'true');
      if (activeFilters.isNewArrival) params.append('isNewArrival', 'true');

      const response = await api.get(`/products?${params.toString()}`);
      
      if (response.data.success) {
        setProducts(response.data.data);
        setPagination(response.data.pagination);
        // Update available filter options based on current filters
        if (response.data.filters) {
          setFilters({
            categories: response.data.filters.categories || [],
            colors: response.data.filters.colors || [],
            materials: response.data.filters.materials || [],
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get('/user/wishlist');
          if (response.data.success) {
            setWishlist(response.data.data.map(item => item._id));
          }
        }
      } catch (err) {
        console.error('Error fetching wishlist:', err);
      }
    };
    fetchWishlist();
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => {
      if (filterType === 'price') {
        return { ...prev, minPrice: value.min, maxPrice: value.max };
      }
      return { ...prev, [filterType]: value };
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setActiveFilters({
      category: [],
      colors: [],
      material: [],
      minPrice: 0,
      maxPrice: 10000,
      inStockOnly: false,
      discount: null,
      isBestSeller: false,
      isNewArrival: false,
    });
    setSearchQuery('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Use default variant values when user hasn't selected any
      const defaultColor = product?.attributes?.colors?.[0] || '';
      const defaultSize = product?.attributes?.sizes?.[0] || '';

      await api.post('/cart/add', {
        productId: product._id,
        quantity: 1,
        selectedColor: defaultColor,
        selectedSize: defaultSize,
      });

      // Show success notification (you can add a toast here)
      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart');
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      if (wishlist.includes(productId)) {
        await api.delete(`/user/wishlist/${productId}`);
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        await api.post('/user/wishlist', { productId });
        setWishlist(prev => [...prev, productId]);
      }
    } catch (err) {
      console.error('Error updating wishlist:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProducts();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Compact Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-purple-600 px-3 py-2">
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">BAGVO</h1>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/cart" className="relative p-2">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-2">
                    <User className="w-5 h-5 text-gray-700" />
                    <span className="hidden md:inline text-sm font-medium text-gray-700">{user.name}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 border-b">
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/account" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"><User className="w-4 h-4" /><span>My Profile</span></Link>
                        <Link to="/account/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"><Package className="w-4 h-4" /><span>My Orders</span></Link>
                        <Link to="/account/wishlist" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"><Heart className="w-4 h-4" /><span>My Wishlist</span></Link>
                      </div>
                      <div className="border-t">
                        <button onClick={() => { setShowUserMenu(false); logout(); }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"><LogOut className="w-4 h-4" /><span>Logout</span></button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="p-2">
                  <User className="w-5 h-5 text-gray-700" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="bg-white rounded-xl p-5" style={{ boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
              <FilterSidebar
                filters={filters}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isMobile={false}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Products Navbar - Search & Sort Controls */}
            <div className="bg-transparent mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex-1 max-w-[320px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for bags..."
                      className="w-full h-10 pl-10 pr-10 bg-white border border-[#E5E7EB] rounded-[10px] focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] transition-all"
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Right Side Controls */}
                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 h-10 bg-[#6D28D9] text-white rounded-[10px] hover:bg-[#5B21B6] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none h-10 pl-4 pr-10 bg-white border border-[#E5E7EB] rounded-[10px] focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] cursor-pointer transition-all"
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
                    >
                      <option value="newest">Newest First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="popular">Popular</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                  </div>

                  {/* View Mode Toggle */}
                  <div className="hidden md:flex items-center bg-white border border-[#E5E7EB] rounded-[8px] p-0.5">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`w-10 h-10 flex items-center justify-center rounded-[8px] transition-all ${
                        viewMode === 'grid'
                          ? 'bg-[#6D28D9] text-white'
                          : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`w-10 h-10 flex items-center justify-center rounded-[8px] transition-all ${
                        viewMode === 'list'
                          ? 'bg-[#6D28D9] text-white'
                          : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D28D9]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-[#6B7280] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  No products found
                </p>
                <button
                  onClick={handleClearFilters}
                  className="text-[#6D28D9] hover:text-[#5B21B6] font-medium transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                      isInWishlist={wishlist.includes(product._id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-5 py-2.5 bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500 }}
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-2">
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`w-10 h-10 rounded-lg transition-all ${
                            pagination.page === i + 1
                              ? 'bg-[#6D28D9] text-white'
                              : 'bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#111827]'
                          }`}
                          style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500 }}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-5 py-2.5 bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500 }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <FilterSidebar
              filters={filters}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isMobile={true}
              onClose={() => setShowMobileFilters(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;
