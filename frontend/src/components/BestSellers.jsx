import { motion } from 'framer-motion';
import { Star, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore, useWishlistStore } from '../store';

const ProductCard = ({ product, index }) => {
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-beige-300">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-beige-50 aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            
            {/* Badge - Editor's Pick etc */}
            {product.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-navy-950 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
                  {product.badge}
                </span>
              </div>
            )}

            {/* Low Stock Warning - NEW */}
            {product.stock && product.stock < 10 && (
              <div className="absolute top-4 left-4 z-10 mt-12">
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                  Only {product.stock} left!
                </span>
              </div>
            )}

            {/* Wishlist Button */}
            <div className="absolute top-4 right-4 z-10">
              <motion.button
                onClick={handleToggleWishlist}
                className={`p-3 rounded-full backdrop-blur-sm transition-all shadow-lg ${
                  isInWishlist(product.id)
                    ? 'bg-gold-600 text-white'
                    : 'bg-white/90 text-navy-700 hover:bg-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              </motion.button>
            </div>

            {/* Quick View & Add to Cart - Appears on Hover */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ y: 20 }}
            >
              <motion.button
                onClick={handleAddToCart}
                className="w-full bg-navy-950 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gold-600 transition-all shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add to Bag
              </motion.button>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="p-6 flex-1 flex flex-col">
            {product.category && (
              <p className="text-xs text-navy-500 mb-2 font-semibold uppercase tracking-wider">{product.category}</p>
            )}

            <h3 className="font-heading text-xl text-navy-950 mb-3 line-clamp-2 group-hover:text-gold-600 transition-colors duration-300">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating || 4) ? 'fill-gold-500 text-gold-500' : 'text-navy-200'}
                  />
                ))}
              </div>
              <span className="text-sm text-navy-600 font-medium">
                {product.rating || 4.0}
              </span>
              <span className="text-xs text-navy-400">
                ({product.reviews || 0})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-heading text-3xl text-navy-950">
                ₹{product.price?.selling?.toLocaleString('en-IN') || 0}
              </span>
              {product.price?.mrp && product.price.mrp > product.price.selling && (
                <>
                  <span className="text-base text-navy-400 line-through">
                    ₹{product.price.mrp.toLocaleString('en-IN')}
                  </span>
                  {product.price.discount > 0 && (
                    <span className="text-xs font-bold text-gold-600">
                      {product.price.discount}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Delivery Info & Payment Options - NEW */}
            <div className="mt-auto space-y-2 pt-3 border-t border-beige-200">
              <div className="flex items-center gap-2 text-xs text-navy-600">
                <span className="text-green-600">✓</span>
                <span>Delivered in 3-5 days</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2 py-1 bg-beige-100 rounded text-navy-700 font-medium">COD Available</span>
                <span className="px-2 py-1 bg-beige-100 rounded text-navy-700 font-medium">EMI Options</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const BestSellers = () => {
  // Sample curated products - limited to 6 premium selections
  const products = [
    {
      id: 1,
      name: 'Premium Travel Trolley Bag 28 Inch',
      category: 'Travel Bags',
      price: 2499,
      originalPrice: 3999,
      rating: 4.5,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&q=80',
      isNew: false,
      isFeatured: true,
      stock: 15,
      badge: 'Customer Favorite',
    },
    {
      id: 2,
      name: 'Elegant Ladies Handbag with Sling',
      category: 'Ladies Bags',
      price: 899,
      originalPrice: 1499,
      rating: 4.8,
      reviews: 245,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
      isNew: true,
      isFeatured: false,
      stock: 8,
      badge: "Editor's Pick",
    },
    {
      id: 3,
      name: 'Bridal Dulhan Purse - Golden',
      category: 'Wedding Collection',
      price: 1299,
      originalPrice: 1999,
      rating: 5,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80',
      isNew: false,
      isFeatured: true,
      stock: 12,
      badge: 'Wedding Bestseller',
    },
    {
      id: 4,
      name: 'Designer Sling Bag for Women',
      category: 'Ladies Bags',
      price: 749,
      originalPrice: 1299,
      rating: 4.4,
      reviews: 187,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
      isNew: false,
      isFeatured: false,
      stock: 18,
      badge: "Editor's Pick",
    },
    {
      id: 5,
      name: 'Trekking Backpack 60L Waterproof',
      category: 'Travel Bags',
      price: 1799,
      originalPrice: 2999,
      rating: 4.7,
      reviews: 98,
      image: 'https://images.unsplash.com/photo-1622260614927-9f9c0f5f2f75?w=600&q=80',
      isNew: true,
      isFeatured: false,
      stock: 6,
      badge: 'Customer Favorite',
    },
    {
      id: 6,
      name: 'Premium Saree Cover Set (Pack of 6)',
      category: 'Covers',
      price: 599,
      originalPrice: 999,
      rating: 4.6,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1610979420678-5d1bd437a2c9?w=600&q=80',
      isNew: false,
      isFeatured: false,
      stock: 25,
      badge: "Editor's Pick",
    },
  ];

  return (
    <section className="py-24 bg-beige-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold-600 text-sm font-semibold mb-3 tracking-widest uppercase">
            Curated Selection
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-navy-950 mb-4 leading-tight">
            Loved by Brides, Travelers & Working Women Across India
          </h2>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto">
            From Delhi weddings to Mumbai offices—discover the bags that became part of unforgettable moments
          </p>
        </motion.div>

        {/* Products Grid - 3 columns, bigger cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 "
        >
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 bg-navy-950 text-black border-black rounded-full font-semibold text-lg flex items-center justify-center gap-2 mx-auto shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              View All Products
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BestSellers;
