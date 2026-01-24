import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RefreshCw,
  Phone,
  Star,
  Check,
  Minus,
  Plus,
  MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [addingToCart, setAddingToCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const images = product?.images || [];
  const placeholderImage = `https://placehold.co/800x800/4F46E5/FFFFFF/png?text=${encodeURIComponent(product?.name?.substring(0, 20) || 'Product')}`;

  const getImageUrl = (index) => {
    let url = null;
    
    if (images.length > 0 && images[index]?.url) {
      url = images[index].url;
    } else if (product?.mainImage) {
      url = product.mainImage;
    }
    
    // If no URL or empty, return placeholder
    if (!url || url.trim() === '') {
      return placeholderImage;
    }
    
    // If URL is relative (starts with /uploads), prepend backend URL
    if (url.startsWith('/uploads')) {
      url = `http://localhost:5000${url}`;
    }
    
    return url;
  };

  useEffect(() => {
    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product) {
      checkWishlist();
      fetchRelatedProducts();
      if (product.attributes?.colors?.length > 0) {
        setSelectedColor(product.attributes.colors[0]);
      }
    }
  }, [product]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/products/${id}`);
      
      if (response.data.success) {
        // Normalize colors coming from backend (some entries are stored as JSON strings)
        const p = response.data.data;
        const normalizeColors = (colors) => {
          if (!colors) return [];
          // If stored as a JSON string like '["black"]'
          if (typeof colors === 'string') {
            try {
              const parsed = JSON.parse(colors);
              if (Array.isArray(parsed)) return parsed;
            } catch (e) {
              return [colors];
            }
          }
          // If it's an array, some elements may themselves be JSON-encoded strings
          if (Array.isArray(colors)) {
            const result = [];
            colors.forEach((c) => {
              if (typeof c === 'string' && c.trim().startsWith('[')) {
                try {
                  const parsed = JSON.parse(c);
                  if (Array.isArray(parsed)) {
                    result.push(...parsed);
                    return;
                  }
                } catch (e) {
                  // fallthrough
                }
              }
              result.push(c);
            });
            return result;
          }
          return [];
        };

        if (p.attributes) {
          p.attributes.colors = normalizeColors(p.attributes.colors);
        }

        setProduct(p);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Product not found');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await api.get(`/products?category=${product.category._id}&limit=4`);
      if (response.data.success) {
        setRelatedProducts(response.data.data.filter(p => p._id !== product._id));
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const checkWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/user/wishlist');
        if (response.data.success) {
          const wishlistIds = response.data.data.map(item => item._id);
          setIsInWishlist(wishlistIds.includes(product._id));
        }
      }
    } catch (err) {
      console.error('Error checking wishlist:', err);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      setAddingToCart(true);
      const result = await addToCart(product._id, quantity, selectedColor);

      if (result.success) {
        setToastMessage('✅ Product added to cart!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        alert(result.message || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const handleWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      if (isInWishlist) {
        await api.delete(`/user/wishlist/${product._id}`);
        setIsInWishlist(false);
      } else {
        await api.post('/user/wishlist', { productId: product._id });
        setIsInWishlist(true);
      }
    } catch (err) {
      console.error('Error updating wishlist:', err);
    }
  };

  const checkDelivery = async (e) => {
    e.preventDefault();
    // Mock delivery check - replace with actual API call
    setDeliveryInfo({
      available: true,
      estimatedDays: '3-5',
      cod: product?.shipping?.codAvailable,
    });
  };

  const handleImageZoom = (e) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-700">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stock === 0;
  const discountPercentage = product.price?.discount || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-indigo-600">Products</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category._id}`} className="hover:text-indigo-600">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-lg shadow-md overflow-hidden aspect-square">
              <motion.div
                className="w-full h-full cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleImageZoom}
              >
                <img
                  src={getImageUrl(selectedImage)}
                  alt={images[selectedImage]?.alt || product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = placeholderImage;
                  }}
                  style={
                    isZoomed
                      ? {
                          transform: 'scale(2)',
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }
                      : {}
                  }
                />
              </motion.div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountPercentage > 0 && (
                  <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {discountPercentage}% OFF
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    NEW ARRIVAL
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-indigo-600 ring-2 ring-indigo-200'
                        : 'border-gray-200 hover:border-indigo-400'
                    }`}
                  >
                    <img
                      src={getImageUrl(index)}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = placeholderImage;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            {product.brand && (
              <div className="text-sm text-gray-600 uppercase tracking-wide font-medium">
                {product.brand}
              </div>
            )}

            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            {product.rating > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating.toFixed(1)} ({product.numReviews} reviews)
                </span>
              </div>
            )}

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-700 text-lg">
                {product.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-indigo-600">
                  ₹{product.price?.selling?.toLocaleString('en-IN')}
                </span>
                {product.price?.mrp > product.price?.selling && (
                  <div className="flex flex-col">
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.price?.mrp?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-green-600 font-semibold">
                      Save ₹{(product.price.mrp - product.price.selling).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">Inclusive of all taxes</p>
            </div>

            {/* Color Selection */}
            {product.attributes?.colors && product.attributes.colors.length > 0 && (
              <div className="space-y-3">
                <label className="font-semibold text-gray-800">
                  Select Color: <span className="text-indigo-600">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {product.attributes.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? 'border-indigo-600 ring-2 ring-indigo-200 scale-110'
                          : 'border-gray-300 hover:border-indigo-400'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="font-semibold text-gray-800">Quantity:</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 py-3 font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {product.stockStatus === 'low_stock' && !isOutOfStock && (
                  <span className="text-sm text-orange-600 font-semibold">
                    Only {product.stock} left in stock!
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addingToCart}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || addingToCart}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Buy Now
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleWishlist}
                  className={`flex items-center justify-center gap-2 px-6 py-3 border-2 rounded-lg font-semibold transition-all ${
                    isInWishlist
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:border-red-500 text-gray-700'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-indigo-500 text-gray-700 transition-all">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Delivery Check */}
            <div className="border-2 border-gray-200 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Check Delivery
              </h3>
              <form onSubmit={checkDelivery} className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter Pincode"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  maxLength={6}
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Check
                </button>
              </form>
              {deliveryInfo && (
                <div className="space-y-2 text-sm">
                  <p className="text-green-600 font-medium flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Delivery available in {deliveryInfo.estimatedDays} days
                  </p>
                  {deliveryInfo.cod && (
                    <p className="text-gray-700 flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Cash on Delivery available
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Truck className="w-8 h-8 text-indigo-600 mb-2" />
                <span className="text-xs font-medium text-gray-700">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <RefreshCw className="w-8 h-8 text-indigo-600 mb-2" />
                <span className="text-xs font-medium text-gray-700">Easy Returns</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="w-8 h-8 text-indigo-600 mb-2" />
                <span className="text-xs font-medium text-gray-700">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Phone className="w-8 h-8 text-indigo-600 mb-2" />
                <span className="text-xs font-medium text-gray-700">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          {/* Tab Headers */}
          <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
            {['description', 'specifications', 'shipping', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="prose max-w-none">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-xl font-bold mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                {product.features && product.features.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-bold mb-4">Specifications</h3>
                <table className="w-full">
                  <tbody className="divide-y">
                    {product.attributes?.material && (
                      <tr>
                        <td className="py-3 font-semibold text-gray-700 w-1/3">Material</td>
                        <td className="py-3 text-gray-600">{product.attributes.material}</td>
                      </tr>
                    )}
                    {product.attributes?.capacity && (
                      <tr>
                        <td className="py-3 font-semibold text-gray-700">Capacity</td>
                        <td className="py-3 text-gray-600">{product.attributes.capacity}</td>
                      </tr>
                    )}
                    {product.attributes?.closureType && (
                      <tr>
                        <td className="py-3 font-semibold text-gray-700">Closure Type</td>
                        <td className="py-3 text-gray-600">{product.attributes.closureType}</td>
                      </tr>
                    )}
                    {product.shipping?.weight && (
                      <tr>
                        <td className="py-3 font-semibold text-gray-700">Weight</td>
                        <td className="py-3 text-gray-600">{product.shipping.weight} kg</td>
                      </tr>
                    )}
                    {product.careInstructions && (
                      <tr>
                        <td className="py-3 font-semibold text-gray-700">Care Instructions</td>
                        <td className="py-3 text-gray-600">{product.careInstructions}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h3 className="text-xl font-bold mb-4">Shipping & Returns</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Delivery Information</h4>
                    <p className="text-gray-700">
                      Expected delivery: {product.shipping?.deliveryDays || '3-5 business days'}
                    </p>
                    <p className="text-gray-700">
                      Cash on Delivery: {product.shipping?.codAvailable ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Return Policy</h4>
                    <p className="text-gray-700">
                      Easy 7-day return policy. Products must be unused and in original packaging.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={() => {}}
                  isInWishlist={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50"
          >
            <Check className="w-6 h-6" />
            <div>
              <p className="font-semibold">{toastMessage}</p>
              <button
                onClick={() => navigate('/cart')}
                className="text-sm underline hover:text-green-100 mt-1"
              >
                View Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;
