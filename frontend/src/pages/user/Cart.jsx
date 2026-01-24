import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Heart,
  Plus,
  Minus,
  ArrowLeft,
  Tag,
  Truck,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, updateQuantity, removeFromCart, moveToWishlist } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(itemId);
    }
  };

  const handleMoveToWishlist = async (itemId) => {
    const result = await moveToWishlist(itemId);
    if (result.success) {
      alert('Item moved to wishlist!');
    }
  };

  const applyCoupon = () => {
    // Mock coupon application - implement with your backend
    if (couponCode.toUpperCase() === 'SAVE10') {
      setAppliedCoupon({ code: 'SAVE10', discount: 10, type: 'percentage' });
      alert('Coupon applied! 10% discount');
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const getImageUrl = (image) => {
    if (!image) return 'https://placehold.co/400x400/E5E7EB/9CA3AF/png?text=No+Image';
    if (image.startsWith('/uploads')) {
      return `http://localhost:5000${image}`;
    }
    return image;
  };

  if (loading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = cart?.totalPrice || 0;
  const totalDiscount = cart?.totalDiscount || 0;
  const deliveryCharges = subtotal > 500 ? 0 : 50;
  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? (subtotal * appliedCoupon.discount) / 100
      : appliedCoupon.discount
    : 0;
  const grandTotal = subtotal - couponDiscount + deliveryCharges;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="mb-6">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
          <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shopping Cart ({cart?.totalItems || 0} items)
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const product = item.product;
                const isAvailable = item.isAvailable !== false && product?.stock > 0;

                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <Link
                        to={`/products/${product?._id}`}
                        className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg overflow-hidden"
                      >
                        <img
                          src={getImageUrl(item.productSnapshot?.image || product?.mainImage)}
                          alt={product?.name || 'Product'}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Link
                              to={`/products/${product?._id}`}
                              className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
                            >
                              {item.productSnapshot?.name || product?.name}
                            </Link>
                            {product?.category && (
                              <p className="text-sm text-gray-500">{product.category.name}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Variants */}
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="flex gap-4 mb-3 text-sm text-gray-600">
                            {item.selectedColor && (
                              <div className="flex items-center gap-2">
                                <span>Color:</span>
                                <div
                                  className="w-5 h-5 rounded-full border-2 border-gray-300"
                                  style={{ backgroundColor: item.selectedColor.toLowerCase() }}
                                />
                                <span className="font-medium">{item.selectedColor}</span>
                              </div>
                            )}
                            {item.selectedSize && (
                              <div>
                                Size: <span className="font-medium">{item.selectedSize}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Stock Status */}
                        {!isAvailable && (
                          <p className="text-sm text-red-600 font-semibold mb-2">Out of Stock</p>
                        )}
                        {isAvailable && product?.stockStatus === 'low_stock' && (
                          <p className="text-sm text-orange-600 font-semibold mb-2">
                            Only {product.stock} left!
                          </p>
                        )}

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border-2 border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || !isAvailable}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              disabled={item.quantity >= (product?.stock || 0) || !isAvailable}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-indigo-600">
                                ₹{((item.productSnapshot?.price || 0) * item.quantity).toLocaleString('en-IN')}
                              </span>
                              {item.productSnapshot?.originalPrice > item.productSnapshot?.price && (
                                <span className="text-sm text-gray-400 line-through">
                                  ₹{((item.productSnapshot?.originalPrice || 0) * item.quantity).toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                            {item.productSnapshot?.discount > 0 && (
                              <p className="text-sm text-green-600">
                                {item.productSnapshot.discount}% off
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mt-4">
                          <button
                            onClick={() => handleMoveToWishlist(item._id)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600"
                          >
                            <Heart className="w-4 h-4" />
                            Move to Wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Price Summary
              </h2>

              {/* Coupon */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Apply Coupon</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <Tag className="w-4 h-4" />
                      <span className="font-semibold">{appliedCoupon.code}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Product Discount</span>
                    <span className="font-semibold">-₹{totalDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Charges</span>
                  <span className="font-semibold">
                    {deliveryCharges === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${deliveryCharges}`
                    )}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-900">Grand Total</span>
                  <span className="text-3xl font-bold text-indigo-600">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="block text-center mt-3 text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <span>Free delivery on orders above ₹500</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <span>100% Secure Payments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
