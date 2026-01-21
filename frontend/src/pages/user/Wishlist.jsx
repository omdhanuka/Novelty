import { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingCart, Eye, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { api } from '../../lib/api';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/user/wishlist');
      if (response.data.success) {
        setWishlistItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  /*const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Premium Leather Backpack',
      price: 2599,
      originalPrice: 3499,
      image: 'https://via.placeholder.com/300',
      inStock: true,
      rating: 4.5,
      reviews: 128,
    },
    {
      id: 2,
      name: 'Canvas Tote Bag',
      price: 1999,
      originalPrice: 2499,
      image: 'https://via.placeholder.com/300',
      inStock: true,
      rating: 4.8,
      reviews: 245,
    },
    {
      id: 3,
      name: 'Travel Duffle Bag',
      price: 3499,
      originalPrice: 4999,
      image: 'https://via.placeholder.com/300',
      inStock: false,
      rating: 4.6,
      reviews: 89,
    },
    {
      id: 4,
      name: 'Laptop Messenger Bag',
      price: 2299,
      originalPrice: 2999,
      image: 'https://via.placeholder.com/300',
      inStock: true,
      rating: 4.7,
      reviews: 156,
    },
  ]);*/

  const [searchQuery, setSearchQuery] = useState('');

  const handleRemove = async (id) => {
    try {
      const response = await api.delete(`/user/wishlist/${id}`);
      if (response.data.success) {
        setWishlistItems(response.data.data);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = (item) => {
    // Add to cart logic
    console.log('Added to cart:', item);
  };

  const filteredItems = wishlistItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateDiscount = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-gray-600 mt-2">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
              {wishlistItems.length > 0 && (
                <button
                  onClick={() => setWishlistItems([])}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
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
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6"
            >
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search in wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            </motion.div>
          )}

          {/* Wishlist Grid */}
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
            >
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No items found' : 'Your wishlist is empty'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? 'Try adjusting your search'
              : 'Save your favorite items and shop them later'}
          </p>
          {!searchQuery && (
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Continue Shopping
              </Link>
            )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Discount Badge */}
                  {item.originalPrice > item.price && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                        {calculateDiscount(item.originalPrice, item.price)}% OFF
                      </span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors group"
                  >
                    <Trash2 size={16} className="text-gray-600 group-hover:text-red-600" />
                  </button>

                  {/* Stock Status */}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {item.inStock ? (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                    )}
                    <Link
                      to={`/product/${item.id}`}
                      className="inline-flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye size={16} className="text-gray-600" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
              </AnimatePresence>
            </div>
          )}

          {/* Wishlist Stats */}
          {filteredItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
            >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wishlist Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{filteredItems.length}</p>
              <p className="text-sm text-gray-500">Total Items</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {filteredItems.filter((item) => item.inStock).length}
              </p>
              <p className="text-sm text-gray-500">In Stock</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">
                ₹{filteredItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Total Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                ₹
                {filteredItems
                  .reduce((sum, item) => sum + (item.originalPrice - item.price), 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">You Save</p>
            </div>
          </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
