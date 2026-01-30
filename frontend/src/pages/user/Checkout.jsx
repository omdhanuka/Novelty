import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Check,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  RefreshCw,
  Lock,
  Plus,
  Tag,
  ChevronDown,
  ChevronUp,
  Wallet,
  Smartphone,
  Building2,
  Banknote,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/useCart';
import { api } from '../../lib/api';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, fetchCart } = useCart();

  // Check if coming from "Buy Now" flow
  const isBuyNow = location.state?.buyNow || false;
  const buyNowProduct = location.state?.product || null;

  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  // Address form
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false,
  });

  // Card form
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  const steps = [
    { id: 1, name: 'Address', icon: MapPin },
    { id: 2, name: 'Order Summary', icon: Truck },
    { id: 3, name: 'Payment', icon: CreditCard },
    { id: 4, name: 'Confirmation', icon: Check },
  ];

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Pay via UPI apps' },
    { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
    { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'All major banks' },
    { id: 'wallet', name: 'Wallets', icon: Wallet, description: 'Paytm, PhonePe, Google Pay' },
    { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive' },
  ];

  useEffect(() => {
    if (!isBuyNow) {
      fetchCart();
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/user/addresses');
      if (response.data.success) {
        setAddresses(response.data.data);
        const defaultAddr = response.data.data.find(addr => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr._id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      // Map frontend form fields to backend schema
      const addressData = {
        name: addressForm.fullName || addressForm.name,
        phone: addressForm.mobile || addressForm.phone,
        addressLine: addressForm.addressLine1 || addressForm.addressLine,
        city: addressForm.city,
        state: addressForm.state,
        pincode: addressForm.pincode,
        isDefault: addressForm.isDefault,
      };

      const response = await api.post('/user/addresses', addressData);
      if (response.data.success) {
        setAddresses([...addresses, response.data.data]);
        setSelectedAddress(response.data.data._id);
        setShowAddressForm(false);
        setAddressForm({
          fullName: '',
          mobile: '',
          email: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          pincode: '',
          landmark: '',
          isDefault: false,
        });
      }
    } catch (error) {
      alert('Failed to add address');
    }
  };

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    setCurrentStep(3);
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setAppliedCoupon({ code: 'SAVE10', discount: 10, type: 'percentage' });
    } else if (couponCode.toUpperCase() === 'FLAT100') {
      setAppliedCoupon({ code: 'FLAT100', discount: 100, type: 'flat' });
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select delivery address');
      return;
    }
    if (!paymentMethod) {
      alert('Please select payment method');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        address: selectedAddress,
        paymentMethod,
        items: isBuyNow ? [buyNowProduct] : cart?.items,
        coupon: appliedCoupon?.code,
      };

      const response = await api.post('/orders', orderData);
      if (response.data.success) {
        setCurrentStep(4);
        // Clear cart if not buy now
        if (!isBuyNow) {
          await api.delete('/cart/clear');
        }
      }
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return 'https://placehold.co/400x400/E5E7EB/9CA3AF/png?text=No+Image';
    if (image.startsWith('/uploads')) return `http://localhost:5000${image}`;
    return image;
  };

  // Calculate totals
  const items = isBuyNow ? [buyNowProduct] : cart?.items || [];
  
  // Calculate MRP total and Selling Price total
  let mrpTotal = 0;
  let sellingTotal = 0;
  
  items.forEach((item) => {
    const product = item.product || item;
    const quantity = item.quantity || 1;
    
    if (isBuyNow) {
      const sellingPrice = item.productSnapshot?.price || product.price?.selling || 0;
      const originalPrice = item.productSnapshot?.originalPrice || product.price?.mrp || sellingPrice;
      sellingTotal += sellingPrice * quantity;
      mrpTotal += originalPrice * quantity;
    } else {
      const sellingPrice = item.productSnapshot?.price || 0;
      const originalPrice = item.productSnapshot?.originalPrice || sellingPrice;
      sellingTotal += sellingPrice * quantity;
      mrpTotal += originalPrice * quantity;
    }
  });
  
  const subtotal = sellingTotal; // What customer actually pays for products
  const discount = mrpTotal - sellingTotal; // Discount = MRP - Selling Price
  const deliveryCharges = subtotal > 500 ? 0 : 50;
  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? (subtotal * appliedCoupon.discount) / 100
      : appliedCoupon.discount
    : 0;
  const taxableAmount = subtotal - couponDiscount;
  const tax = Math.round(taxableAmount * 0.18); // 18% GST on taxable amount
  const grandTotal = subtotal - couponDiscount + deliveryCharges + tax;

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => navigate('/orders')}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 mb-3"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-indigo-600 hover:text-indigo-600"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Buy Now Label */}
        {isBuyNow && (
          <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800 font-semibold flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Buy Now - Express Checkout
            </p>
          </div>
        )}

        {/* Progress Stepper */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 rounded ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Delivery Address */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <MapPin className="w-6 h-6 text-indigo-600" />
                  Delivery Address
                </h2>

                {/* Saved Addresses */}
                <div className="space-y-4 mb-6">
                  {addresses.map((address) => (
                    <label
                      key={address._id}
                      className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedAddress === address._id
                          ? 'border-indigo-600 bg-purple-50'
                          : 'border-gray-200 hover:border-indigo-400'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === address._id}
                          onChange={() => setSelectedAddress(address._id)}
                          className="mt-1 w-5 h-5 text-indigo-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{address.name || address.fullName || ''}</span>
                            {address.isDefault && (
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">
                            {address.addressLine || address.addressLine1 || ''}{address.addressLine2 && `, ${address.addressLine2}`}
                            {address.city && `, ${address.city}`}{address.state && `, ${address.state}`}{address.pincode && ` - ${address.pincode}`}
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            Mobile: {address.phone || address.mobile || ''}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Add New Address Button */}
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Address
                  </button>
                )}

                {/* Add Address Form */}
                {showAddressForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleAddAddress}
                    className="mt-6 p-6 bg-gray-50 rounded-xl space-y-4"
                  >
                    <h3 className="font-semibold text-gray-900 mb-4">New Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        required
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <input
                        type="tel"
                        placeholder="Mobile Number *"
                        required
                        value={addressForm.mobile}
                        onChange={(e) => setAddressForm({ ...addressForm, mobile: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <input
                        type="email"
                        placeholder="Email *"
                        required
                        value={addressForm.email}
                        onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 md:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="House No. / Street *"
                        required
                        value={addressForm.addressLine1}
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 md:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Area / Locality"
                        value={addressForm.addressLine2}
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 md:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="City *"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="State *"
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Pincode *"
                        required
                        maxLength={6}
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Landmark (Optional)"
                        value={addressForm.landmark}
                        onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <label htmlFor="isDefault" className="text-sm text-gray-700">
                        Make this my default address
                      </label>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Continue Button */}
                <button
                  onClick={handleContinueToPayment}
                  disabled={!selectedAddress}
                  className="w-full mt-6 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Order Items Preview */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Order Items
                  </h2>
                  <div className="space-y-4">
                    {items.map((item, index) => {
                      const product = item.product || item;
                      return (
                        <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                          <img
                            src={getImageUrl(item.productSnapshot?.image || product.mainImage)}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{item.productSnapshot?.name || product.name}</h3>
                            {item.selectedColor && (
                              <p className="text-sm text-gray-600">Color: {item.selectedColor}</p>
                            )}
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            <p className="font-semibold text-indigo-600 mt-1">
                              ₹{((item.productSnapshot?.price || product.price?.selling || 0) * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                    <CreditCard className="w-6 h-6 text-indigo-600" />
                    Payment Method
                  </h2>

                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'border-indigo-600 bg-purple-50'
                            : 'border-gray-200 hover:border-indigo-400'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === method.id}
                            onChange={() => setPaymentMethod(method.id)}
                            className="w-5 h-5 text-indigo-600"
                          />
                          <method.icon className="w-6 h-6 text-gray-700" />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{method.name}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Card Form */}
                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 p-6 bg-gray-50 rounded-xl space-y-4"
                    >
                      <input
                        type="text"
                        placeholder="Card Number"
                        maxLength={16}
                        value={cardForm.cardNumber}
                        onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardForm.cardHolder}
                        onChange={(e) => setCardForm({ ...cardForm, cardHolder: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardForm.expiry}
                          onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          maxLength={3}
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Trust Signals */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col items-center text-center">
                      <Lock className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-600 font-medium">100% Secure</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <RefreshCw className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-600 font-medium">Easy Returns</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Truck className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-600 font-medium">Fast Delivery</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Shield className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-600 font-medium">SSL Encrypted</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={!paymentMethod || loading}
                  className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-6 h-6" />
                      Place Order - ₹{grandTotal.toLocaleString('en-IN')}
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>

          {/* Right Column - Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:sticky lg:top-4">
              {/* Mobile Toggle */}
              <button
                onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
                className="lg:hidden w-full flex items-center justify-between mb-4 pb-4 border-b border-gray-200"
              >
                <span className="font-bold text-lg">Order Summary</span>
                {orderSummaryOpen ? <ChevronUp /> : <ChevronDown />}
              </button>

              <div className={`${orderSummaryOpen ? 'block' : 'hidden'} lg:block`}>
                <h2 className="hidden lg:block text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Order Summary
                </h2>

                {/* Price Details */}
                <div className="space-y-3 mb-6">
                  {mrpTotal > subtotal && (
                    <div className="flex justify-between text-gray-500 text-sm">
                      <span>MRP Total</span>
                      <span className="line-through">₹{mrpTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Product Discount</span>
                      <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
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
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (GST 18%)</span>
                    <span className="font-semibold">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="mb-6 pb-6 border-t border-b border-gray-200 py-6">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Apply Coupon</label>
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
                        placeholder="Enter code"
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
                  <p className="text-xs text-gray-500 mt-2">Try: SAVE10 or FLAT100</p>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold text-gray-900">Grand Total</span>
                  <span className="text-3xl font-bold text-indigo-600">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Mobile Sticky CTA */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-2xl z-50">
                  {currentStep === 1 && (
                    <button
                      onClick={handleContinueToPayment}
                      disabled={!selectedAddress}
                      className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                      Continue to Payment
                    </button>
                  )}
                  {currentStep === 3 && (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!paymentMethod || loading}
                      className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                      {loading ? 'Processing...' : `Place Order - ₹${grandTotal.toLocaleString('en-IN')}`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
