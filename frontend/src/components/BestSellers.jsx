import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Eye, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore, useWishlistStore } from '../store';

const ProductCard = ({ product }) => {
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-slate-100">
        {/* Image Container */}
        <Link to={`/product/${product.id}`} className="relative block overflow-hidden bg-slate-50 aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {discount > 0 && (
              <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                -{discount}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                NEW
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <TrendingUp size={12} />
                HOT
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <motion.button
              onClick={handleToggleWishlist}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg ${
                isInWishlist(product.id)
                  ? 'bg-pink-600 text-white'
                  : 'bg-white/90 text-slate-700 hover:bg-white'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
            </motion.button>
            <motion.button
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye size={18} />
            </motion.button>
          </div>

          {/* Quick Add to Cart - Appears on Hover */}
          <motion.button
            onClick={handleAddToCart}
            className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:from-amber-600 hover:to-orange-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingCart size={18} />
            Add to Cart
          </motion.button>
        </Link>

        {/* Product Info */}
        <div className="p-5 flex-1 flex flex-col">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
              {product.name}
            </h3>
          </Link>

          {product.category && (
            <p className="text-sm text-slate-500 mb-3 font-medium">{product.category}</p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(product.rating || 4) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
              />
            ))}
            <span className="text-sm text-slate-600 ml-2 font-semibold">
              {product.rating || 4.0}
            </span>
            <span className="text-xs text-slate-400">
              ({product.reviews || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-auto mb-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-base text-slate-400 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Save ₹{product.originalPrice - product.price}
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-orange-600 font-bold">
                Only {product.stock} left!
              </span>
            </div>
          )}
          {product.stock === 0 && (
            <p className="text-xs text-red-600 font-semibold mt-2">
              Out of Stock
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const BestSellers = () => {
  // Sample products - This will be replaced with API data
  const products = [
    {
      id: 1,
      name: 'Premium Travel Trolley Bag 28 Inch',
      category: 'Travel Bags',
      price: 2499,
      originalPrice: 3999,
      rating: 4.5,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=500',
      isNew: false,
      isFeatured: true,
      stock: 15,
    },
    {
      id: 2,
      name: 'Elegant Ladies Handbag with Sling',
      category: 'Ladies Bags',
      price: 899,
      originalPrice: 1499,
      rating: 4.8,
      reviews: 245,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500',
      isNew: true,
      isFeatured: false,
      stock: 8,
    },
    {
      id: 3,
      name: 'Bridal Dulhan Purse - Golden',
      category: 'Wedding Collection',
      price: 1299,
      originalPrice: 1999,
      rating: 5,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500',
      isNew: false,
      isFeatured: true,
      stock: 12,
    },
    {
      id: 4,
      name: 'Premium Saree Cover Set (Pack of 6)',
      category: 'Covers',
      price: 599,
      originalPrice: 999,
      rating: 4.6,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1610979420678-5d1bd437a2c9?w=500',
      isNew: false,
      isFeatured: false,
      stock: 25,
    },
    {
      id: 5,
      name: 'Trekking Backpack 60L Waterproof',
      category: 'Travel Bags',
      price: 1799,
      originalPrice: 2999,
      rating: 4.7,
      reviews: 98,
      image: 'https://images.unsplash.com/photo-1622260614927-9f9c0f5f2f75?w=500',
      isNew: true,
      isFeatured: false,
      stock: 6,
    },
    {
      id: 6,
      name: 'Designer Sling Bag for Women',
      category: 'Ladies Bags',
      price: 749,
      originalPrice: 1299,
      rating: 4.4,
      reviews: 187,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500',
      isNew: false,
      isFeatured: false,
      stock: 18,
    },
    {
      id: 7,
      name: 'Cosmetic Makeup Bag - Wedding Special',
      category: 'Wedding Collection',
      price: 499,
      originalPrice: 799,
      rating: 4.9,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
      isNew: true,
      isFeatured: true,
      stock: 20,
    },
    {
      id: 8,
      name: 'Leather Wallet for Women',
      category: 'Ladies Bags',
      price: 399,
      originalPrice: 699,
      rating: 4.5,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
      isNew: false,
      isFeatured: false,
      stock: 30,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-gradient-to-tr from-pink-200 to-purple-200 rounded-full blur-3xl opacity-20" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-4"
          >
            <TrendingUp className="text-orange-600" size={18} />
            <span className="text-orange-900 font-semibold text-sm">Trending Now</span>
          </motion.div>
          
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Best Sellers
          </motion.h2>
          
          <motion.p
            className="text-xl text-slate-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Discover our most loved products, handpicked by thousands of happy customers
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            View All Products
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BestSellers;
