import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onAddToCart, onAddToWishlist, isInWishlist }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: product.mainImage, alt: product.name }];

  // Placeholder image if no images available
  const placeholderImage = 'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=' + 
    encodeURIComponent(product.name?.substring(0, 20) || 'Product');

  const getImageUrl = (index) => {
    const img = images[index];
    return img?.url || product.mainImage || placeholderImage;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToWishlist(product._id);
  };

  const discountPercentage = product.price?.discount || 0;
  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Link to={`/products/${product.slug || product._id}`}>
        <div
          className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setCurrentImage(0);
          }}
        >
          {/* Image Section */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            {/* Main Image */}
            <motion.img
              src={getImageUrl(currentImage)}
              alt={images[currentImage]?.alt || product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                e.target.src = placeholderImage;
              }}
            />

            {/* Hover Image (if available) */}
            {isHovered && images.length > 1 && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={getImageUrl(1)}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white text-lg font-semibold px-4 py-2 bg-red-600 rounded">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {discountPercentage}% OFF
                </span>
              )}
              {product.isNewArrival && (
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  NEW
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  BESTSELLER
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
                isInWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
              } shadow-md`}
              aria-label="Add to wishlist"
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>

            {/* Quick Actions (Visible on Hover) */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {!isOutOfStock && (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              )}
            </div>

            {/* COD Badge */}
            {product.shipping?.codAvailable && (
              <div className="absolute bottom-3 left-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                COD Available
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Brand */}
            {product.brand && (
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {product.brand}
              </p>
            )}

            {/* Product Name */}
            <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(product.rating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  ({product.numReviews})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold text-indigo-600">
                ₹{product.price?.selling?.toLocaleString('en-IN')}
              </span>
              {product.price?.mrp > product.price?.selling && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.price?.mrp?.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Features/Short Description */}
            {product.shortDescription && (
              <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                {product.shortDescription}
              </p>
            )}

            {/* Colors (if available) */}
            {product.attributes?.colors && product.attributes.colors.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                {product.attributes.colors.slice(0, 5).map((color, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
                {product.attributes.colors.length > 5 && (
                  <span className="text-xs text-gray-500">
                    +{product.attributes.colors.length - 5}
                  </span>
                )}
              </div>
            )}

            {/* Stock Status */}
            {product.stockStatus === 'low_stock' && !isOutOfStock && (
              <p className="text-xs text-orange-600 font-semibold mt-2">
                Only {product.stock} left!
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
