import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, ChevronDown, Search, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from '../../components/FilterSidebar';
import { api } from '../../lib/api';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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

  // Fetch products
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
        setFilters(response.data.filters || filters);
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

      await api.post('/cart/add', {
        productId: product._id,
        quantity: 1,
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
    <div className="min-h-screen bg-gray-50">
      {/* Header/Breadcrumb */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Premium Collection
          </h1>
          <p className="text-indigo-100">
            Discover {pagination.total} exclusive products
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isMobile={false}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex-1 max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </form>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <Filter className="w-5 h-5" />
                    Filters
                  </button>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="bestseller">Best Sellers</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* View Mode Toggle */}
                  <div className="hidden md:flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${
                        viewMode === 'grid'
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${
                        viewMode === 'list'
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {Object.values(activeFilters).some(v => 
                Array.isArray(v) ? v.length > 0 : v && v !== 0 && v !== 10000
              ) && (
                <div className="flex items-center gap-2 flex-wrap mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600 font-medium">Active Filters:</span>
                  {/* Add visual filter tags here */}
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600 mb-4">No products found</p>
                <button
                  onClick={handleClearFilters}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
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
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-2">
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-4 py-2 rounded-lg ${
                            pagination.page === i + 1
                              ? 'bg-indigo-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
