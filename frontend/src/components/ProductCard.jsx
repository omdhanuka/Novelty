import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onAddToWishlist, isInWishlist }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: product.mainImage, alt: product.name }];

  // Placeholder image if no images available - Using a more reliable service
  const placeholderImage = `https://placehold.co/400x400/4F46E5/FFFFFF/png?text=${encodeURIComponent(product.name?.substring(0, 15) || 'Product')}`;

  const getImageUrl = (index) => {
    const img = images[index];
    if (!img) return placeholderImage;
    
    // Check if URL exists and is not empty
    let url = img?.url || product.mainImage;
    if (!url || url.trim() === '') return placeholderImage;
    
    // If URL is relative (starts with /uploads), prepend backend URL
    if (url.startsWith('/uploads')) {
      url = `http://localhost:5000${url}`;
    }
    
    return url;
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
    <div className="group relative">
      <Link to={`/products/${product._id}`}>
        <div
          className="relative bg-white rounded-2xl p-3 transition-all duration-300 hover:shadow-xl"
          style={{ 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setCurrentImage(0);
          }}
        >
          {/* Image Section */}
          <div className="relative aspect-square overflow-hidden bg-[#F9FAFB] rounded-xl mb-3">
            {/* Main Image */}
            <img
              src={getImageUrl(currentImage)}
              alt={images[currentImage]?.alt || product.name}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
              loading="lazy"
              onError={(e) => {
                e.target.src = placeholderImage;
              }}
            />

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-xl">
                <span className="text-white text-sm font-semibold px-4 py-2 bg-[#EF4444] rounded-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Out of Stock
                </span>
              </div>
            )}

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-2 left-2">
                <span className="bg-[#EF4444] text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-md" style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600 }}>
                  {discountPercentage}% OFF
                </span>
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
                isInWishlist
                  ? 'bg-[#EF4444] text-white'
                  : 'bg-white text-[#9CA3AF] hover:bg-[#EF4444] hover:text-white'
              } shadow-md`}
              aria-label="Add to wishlist"
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>

            {/* Add to Cart Button - Visible on Hover */}
            {!isOutOfStock && (
              <div 
                className="absolute bottom-3 left-3 right-3 transition-all duration-300"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateY(0)' : 'translateY(10px)'
                }}
              >
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#6D28D9] hover:bg-[#5B21B6] text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Product Name */}
            <h3 
              className="text-[#111827] mb-1.5 line-clamp-2 min-h-[2.5rem] transition-colors"
              style={{ 
                fontFamily: 'Inter, sans-serif', 
                fontSize: '15px', 
                fontWeight: 600,
                lineHeight: '1.4'
              }}
            >
              {product.name}
            </h3>

            {/* Price Section */}
            <div className="flex items-baseline gap-2 mb-1">
              <span 
                className="text-[#6D28D9]" 
                style={{ 
                  fontFamily: 'Inter, sans-serif', 
                  fontSize: '18px', 
                  fontWeight: 700 
                }}
              >
                ₹{product.price?.selling?.toLocaleString('en-IN')}
              </span>
              {product.price?.mrp > product.price?.selling && (
                <>
                  <span 
                    className="text-[#9CA3AF] line-through" 
                    style={{ 
                      fontFamily: 'Inter, sans-serif', 
                      fontSize: '14px' 
                    }}
                  >
                    ₹{product.price?.mrp?.toLocaleString('en-IN')}
                  </span>
                  {discountPercentage > 0 && (
                    <span 
                      className="text-[#16A34A]" 
                      style={{ 
                        fontFamily: 'Inter, sans-serif', 
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    >
                      {discountPercentage}% off
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Stock Status */}
            {product.stockStatus === 'low_stock' && !isOutOfStock && (
              <p 
                className="text-[#EF4444]" 
                style={{ 
                  fontFamily: 'Inter, sans-serif', 
                  fontSize: '12px',
                  fontWeight: 500
                }}
              >
                Only {product.stock} left!
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
