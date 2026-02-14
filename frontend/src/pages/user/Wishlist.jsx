import { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingCart, Eye, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { api } from '../../lib/api';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/user/wishlist');
      if (response.data.success) {
        console.log('=== FRONTEND WISHLIST DEBUG ===');
        console.log('Raw response:', response.data);
        console.log('Total items:', response.data.data?.length);
        
        // Log detailed info for each item
        response.data.data.forEach((item, index) => {
          console.log(`\nItem ${index + 1}: ${item.name}`);
          console.log('  Raw data:', {
            _id: item._id,
            stock: item.stock,
            stockStatus: item.stockStatus,
            lowStockThreshold: item.lowStockThreshold,
            price: item.price
          });
          
          const isAvailable = item.stock > 0 && item.stockStatus !== 'out_of_stock';
          console.log(`  Calculated availability: ${isAvailable ? '✅ IN STOCK' : '❌ OUT OF STOCK'}`);
        });
        console.log('================================\n');
        
        setWishlistItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const response = await api.delete(`/user/wishlist/${productId}`);
      if (response.data.success) {
        setWishlistItems(response.data.data);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove item from wishlist');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear your entire wishlist?')) return;
    
    try {
      const response = await api.delete('/user/wishlist');
      if (response.data.success) {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      alert('Failed to clear wishlist');
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await api.post('/cart', { productId: item._id, quantity: 1 });
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const getImageUrl = (item) => {
    // Get the image URL from mainImage or first image in array
    let imageUrl = item.mainImage || item.images?.[0]?.url || '';
    
    console.log(`Image URL for ${item.name}:`, {
      mainImage: item.mainImage,
      firstImageUrl: item.images?.[0]?.url,
      imagesArray: item.images,
      finalUrl: imageUrl
    });
    
    // If no image found, return placeholder
    if (!imageUrl || imageUrl.trim() === '') {
      const placeholder = `https://placehold.co/400x400/9333EA/FFFFFF/png?text=${encodeURIComponent(item.name?.substring(0, 15) || 'Product')}`;
      console.log(`  → Using placeholder: ${placeholder}`);
      return placeholder;
    }
    
    // If URL is relative (starts with /uploads), prepend backend URL
    if (imageUrl.startsWith('/uploads')) {
      imageUrl = `http://localhost:5000${imageUrl}`;
      console.log(`  → Prepended backend URL: ${imageUrl}`);
    }
    
    return imageUrl;
  };

  const isInStock = (item) => {
    // More robust stock checking
    if (!item) return false;
    
    const stockCount = typeof item.stock === 'number' ? item.stock : 0;
    const status = item.stockStatus || 'out_of_stock';
    
    // Item is in stock if:
    // 1. Stock count is greater than 0
    // 2. Stock status is either 'in_stock' or 'low_stock' (but not 'out_of_stock')
    const inStock = stockCount > 0 && status !== 'out_of_stock';
    
    console.log(`Stock check for ${item.name}:`, { 
      stock: stockCount, 
      status, 
      result: inStock 
    });
    
    return inStock;
  };

  const filteredItems = wishlistItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  My Wishlist
                </h1>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  <span>{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved</span>
                </p>
              </div>
              {wishlistItems.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              )}
            </div>
          </motion.div>

          {/* Search */}
          {wishlistItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-purple-100 p-4 mb-6"
            >
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-purple-100 p-12 md:p-16 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={48} className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchQuery ? 'No items found' : 'Your wishlist is empty'}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchQuery
                  ? 'Try adjusting your search or clear the filter'
                  : 'Start adding products you love to keep track of them here'}
              </p>
              {!searchQuery && (
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                >
                  <ShoppingCart size={18} />
                  Browse Products
                </Link>
              )}
            </motion.div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item, index) => {
                    const inStock = isInStock(item);
                    const imageUrl = getImageUrl(item);
                    const sellingPrice = item.price?.selling || 0;
                    const mrpPrice = item.price?.mrp || sellingPrice;
                    const discount = item.price?.discount || 0;
                    const stockCount = item.stock || 0;
                    const isLowStock = item.stockStatus === 'low_stock' && stockCount > 0;

                    return (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden group hover:shadow-xl hover:border-purple-200 transition-all duration-300"
                      >
                        {/* Product Image */}
                        <Link to={`/products/${item.slug || item._id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = `https://placehold.co/400x400/9333EA/FFFFFF/png?text=${encodeURIComponent(item.name?.substring(0, 15) || 'Product')}`;
                            }}
                          />
                          
                          {/* Discount Badge */}
                          {discount > 0 && inStock && (
                            <div className="absolute top-3 left-3">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md">
                                {discount}% OFF
                              </span>
                            </div>
                          )}

                          {/* Low Stock Badge */}
                          {isLowStock && (
                            <div className="absolute top-3 left-3">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md">
                                Only {stockCount} left
                              </span>
                            </div>
                          )}

                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemove(item._id);
                            }}
                            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors group/btn"
                          >
                            <Heart size={16} className="text-red-500 fill-red-500 group-hover/btn:scale-110 transition-transform" />
                          </button>

                          {/* Stock Status Overlay */}
                          {!inStock && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                              <span className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-lg">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </Link>

                        {/* Product Details */}
                        <div className="p-4">
                          <Link to={`/products/${item.slug || item._id}`}>
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
                              {item.name}
                            </h3>
                          </Link>

                          {/* Rating */}
                          {item.rating > 0 && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-400">★</span>
                                <span className="text-sm font-medium text-gray-900">
                                  {item.rating.toFixed(1)}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                ({item.numReviews || 0})
                              </span>
                            </div>
                          )}

                          {/* Price */}
                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-xl font-bold text-gray-900">
                              ₹{sellingPrice.toLocaleString()}
                            </span>
                            {mrpPrice > sellingPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{mrpPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            {inStock ? (
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm hover:shadow-md"
                              >
                                <ShoppingCart size={16} />
                                <span className="text-sm font-medium">Add to Cart</span>
                              </button>
                            ) : (
                              <button
                                disabled
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                              >
                                <span className="text-sm font-medium">Out of Stock</span>
                              </button>
                            )}
                            <Link
                              to={`/products/${item._id}`}
                              className="inline-flex items-center justify-center w-11 h-11 border-2 border-purple-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
                            >
                              <Eye size={18} className="text-purple-600" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Wishlist Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg border border-purple-100 p-6 mt-8"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  Wishlist Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {filteredItems.length}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Total Items</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">
                      {filteredItems.filter((item) => isInStock(item)).length}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">In Stock</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-3xl font-bold text-red-600">
                      {filteredItems.filter((item) => !isInStock(item)).length}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Out of Stock</p>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <p className="text-3xl font-bold text-indigo-600">
                      ₹{filteredItems.reduce((sum, item) => sum + (item.price?.selling || 0), 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Total Value</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-3xl font-bold text-orange-600">
                      ₹{filteredItems.reduce((sum, item) => {
                        const mrp = item.price?.mrp || 0;
                        const selling = item.price?.selling || 0;
                        return sum + (mrp - selling);
                      }, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">You Save</p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
