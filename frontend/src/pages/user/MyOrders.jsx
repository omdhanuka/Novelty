import { useState, useEffect } from 'react';
import { Search, Filter, Package, Clock, CheckCircle, XCircle, Eye, ChevronRight, Truck, ShoppingBag, CheckCircle2, Ban, RefreshCw, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { api } from '../../lib/api';

const MyOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/user/orders');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  /*const orders = [
    {
      id: 'ORD001234',
      date: '2024-01-15',
      status: 'delivered',
      total: 4599,
      items: 2,
      products: [
        { name: 'Leather Backpack', image: 'https://via.placeholder.com/80', qty: 1, price: 2599 },
        { name: 'Canvas Tote Bag', image: 'https://via.placeholder.com/80', qty: 1, price: 2000 },
      ],
    },
    {
      id: 'ORD001235',
      date: '2024-01-18',
      status: 'in-transit',
      total: 3499,
      items: 1,
      products: [
        { name: 'Travel Duffle Bag', image: 'https://via.placeholder.com/80', qty: 1, price: 3499 },
      ],
    },
    {
      id: 'ORD001236',
      date: '2024-01-20',
      status: 'processing',
      total: 5999,
      items: 3,
      products: [
        { name: 'Laptop Bag', image: 'https://via.placeholder.com/80', qty: 1, price: 2499 },
        { name: 'Wallet', image: 'https://via.placeholder.com/80', qty: 2, price: 1750 },
      ],
    },
    {
      id: 'ORD001237',
      date: '2024-01-22',
      status: 'cancelled',
      total: 1999,
      items: 1,
      products: [
        { name: 'Crossbody Bag', image: 'https://via.placeholder.com/80', qty: 1, price: 1999 },
      ],
    },
  ];*/

  const statusConfig = {
    placed: { label: 'Placed', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: ShoppingBag },
    confirmed: { label: 'Processing', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
    packed: { label: 'Processing', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Package },
    shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', icon: Ban },
    refunded: { label: 'Refunded', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: RefreshCw },
    processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
    'in-transit': { label: 'Shipped', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck },
  };

  // Normalize orders from backend or legacy sample format
  const normalizeOrder = (order) => {
    // backend: orderNumber, createdAt, orderStatus, totalPrice, items
    // legacy/sample: id, date, status, total, products
    const id = order._id || order.id || order.orderNumber || '';
    const orderNumber = order.orderNumber || order.id || '';
    const date = order.createdAt || order.date || '';
    const status = order.orderStatus || order.status || '';
    const total = order.totalPrice || order.total || 0;
    
    // Process items with comprehensive image fallback
    const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Cg transform='translate(100 100)'%3E%3Crect x='-30' y='-45' width='60' height='60' fill='%23d1d5db' rx='3'/%3E%3Ccircle cx='0' cy='-25' r='8' fill='%239ca3af'/%3E%3Cpath d='M -18 -12 L -8 -22 L 3 -12 L 18 -25 L 18 0 L -18 0 Z' fill='%239ca3af'/%3E%3C/g%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='12' x='100' y='140' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
    const products = order.items
      ? order.items.map((it) => {
          // Get image URL with multiple fallbacks
          let imageUrl = placeholderSvg;
          
          if (it.image && it.image.trim() !== '') {
            imageUrl = it.image;
          } else if (it.product?.mainImage && it.product.mainImage.trim() !== '') {
            imageUrl = it.product.mainImage;
          } else if (it.product?.images && Array.isArray(it.product.images) && it.product.images.length > 0) {
            const firstImage = it.product.images[0];
            imageUrl = typeof firstImage === 'object' ? (firstImage?.url || placeholderSvg) : firstImage;
          }
          
          // Convert relative URL to absolute URL
          if (imageUrl && !imageUrl.startsWith('data:image') && !imageUrl.startsWith('http')) {
            const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
            imageUrl = `http://localhost:5000${cleanPath}`;
          }
          
          return { 
            name: it.name || it.product?.name || 'Product', 
            image: imageUrl,
            qty: it.quantity || 1, 
            price: it.price || 0 
          };
        })
      : order.products || [];

    return { ...order, id, orderNumber, date, status, total, products };
  };

  const normalizedOrders = orders.map(normalizeOrder);

  const [cancelingId, setCancelingId] = useState(null);

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmCancel) return;

    try {
      setCancelingId(orderId);
      // Call backend cancel endpoint
      const res = await api.post(`/user/orders/${orderId}/cancel`);
      if (res.data && res.data.success) {
        // Update local orders state to reflect cancellation
        setOrders((prev) =>
          prev.map((o) => {
            if (o._id === orderId || o.id === orderId || o.orderNumber === orderId) {
              return { ...o, orderStatus: 'cancelled', status: 'cancelled' };
            }
            return o;
          })
        );
      } else {
        console.error('Cancel failed:', res.data);
        alert((res.data && res.data.message) || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        alert(serverMessage);
      } else {
        alert(error.message || 'Cancel request failed');
      }
    } finally {
      setCancelingId(null);
    }
  };

  const isCancellable = (status) => {
    const key = (status || '').toString().toLowerCase();
    // Allow cancellation for early-stage statuses; shipped+ cannot be cancelled
    return ['pending', 'processing', 'placed', 'confirmed'].includes(key);
  };

  const filteredOrders = normalizedOrders.filter((order) => {
    const idStr = (order.orderNumber || '').toString();
    const matchesSearch = idStr.toLowerCase().includes((searchQuery || '').toLowerCase());
    const matchesStatus = statusFilter === 'all' || (order.status || '').toString() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const key = (status || '').toString().toLowerCase();
    
    const statusConfig = {
      delivered: { color: 'text-green-600', dot: 'bg-green-600', label: 'Delivered' },
      cancelled: { color: 'text-red-600', dot: 'bg-red-600', label: 'Cancelled' },
      refunded: { color: 'text-orange-600', dot: 'bg-orange-600', label: 'Returned' },
      placed: { color: 'text-blue-600', dot: 'bg-blue-600', label: 'Processing' },
      confirmed: { color: 'text-blue-600', dot: 'bg-blue-600', label: 'Processing' },
      packed: { color: 'text-blue-600', dot: 'bg-blue-600', label: 'Processing' },
      processing: { color: 'text-blue-600', dot: 'bg-blue-600', label: 'Processing' },
      shipped: { color: 'text-amber-600', dot: 'bg-amber-600', label: 'On the way' },
      'in-transit': { color: 'text-amber-600', dot: 'bg-amber-600', label: 'On the way' },
    };
    
    const config = statusConfig[key] || { color: 'text-gray-600', dot: 'bg-gray-600', label: 'Unknown' };
    
    return (
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
        <span className={`text-sm font-medium ${config.color}`} style={{ fontFamily: 'Inter, sans-serif' }}>
          {config.label}
        </span>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F1F3F6] py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {/* Left Sidebar - Filters */}
            <div className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-sm shadow-sm p-5 sticky top-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Filters
                </h2>

                {/* Order Status Filter */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    ORDER STATUS
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      { value: 'all', label: 'All Orders' },
                      { value: 'placed', label: 'Processing' },
                      { value: 'shipped', label: 'On the way' },
                      { value: 'delivered', label: 'Delivered' },
                      { value: 'cancelled', label: 'Cancelled' },
                      { value: 'refunded', label: 'Returned' },
                    ].map((status) => (
                      <label key={status.value} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="statusFilter"
                          value={status.value}
                          checked={statusFilter === status.value}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {status.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Order Time Filter */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    ORDER TIME
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      { value: 'all', label: 'Anytime' },
                      { value: '30', label: 'Last 30 days' },
                      { value: '2024', label: '2024' },
                      { value: '2023', label: '2023' },
                      { value: 'older', label: 'Older' },
                    ].map((time) => (
                      <label key={time.value} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="timeFilter"
                          value={time.value}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {time.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Search Bar */}
              <div className="bg-white rounded-sm shadow-sm p-5 mb-4">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your orders here"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
              </div>

              {loading ? (
                <div className="bg-white rounded-sm shadow-sm p-20 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Loading your orders...
                  </p>
                </div>
              ) : (
                <>
                  {/* Orders List */}
              <AnimatePresence mode="wait">
                {filteredOrders.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-sm shadow-sm p-16 text-center"
                  >
                    <Package size={64} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      No orders found
                    </h3>
                    <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {searchQuery || statusFilter !== 'all'
                        ? 'Try adjusting your search or filters'
                        : "You haven't placed any orders yet"}
                    </p>
                    {!searchQuery && statusFilter === 'all' && (
                      <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Start Shopping
                      </Link>
                    )}
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order, orderIndex) => (
                      <motion.div
                        key={order.id || order.orderNumber || orderIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: orderIndex * 0.05 }}
                        className="bg-white rounded-sm shadow-sm overflow-hidden"
                      >
                        {/* Order Products - Each as a row */}
                        {order.products.map((product, productIndex) => (
                          <div
                            key={productIndex}
                            className={`flex gap-6 p-5 ${
                              productIndex < order.products.length - 1 ? 'border-b border-gray-100' : ''
                            }`}
                          >
                            {/* Product Image */}
                            <div className="w-24 h-24 shrink-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover border border-gray-200"
                                onError={(e) => {
                                  const placeholderSvg =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Cg transform='translate(100 100)'%3E%3Crect x='-30' y='-45' width='60' height='60' fill='%23d1d5db' rx='3'/%3E%3Ccircle cx='0' cy='-25' r='8' fill='%239ca3af'/%3E%3Cpath d='M -18 -12 L -8 -22 L 3 -12 L 18 -25 L 18 0 L -18 0 Z' fill='%239ca3af'/%3E%3C/g%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='12' x='100' y='140' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                                  if (!e.target.src.startsWith('data:image')) {
                                    e.target.src = placeholderSvg;
                                  }
                                }}
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-normal text-gray-900 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Qty: {product.qty}
                              </p>
                              <p className="text-base font-medium text-gray-900 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                                ₹{product.price.toLocaleString('en-IN')}
                              </p>
                            </div>

                            {/* Status & Actions */}
                            <div className="flex flex-col items-end justify-start shrink-0" style={{ minWidth: '280px' }}>
                              {/* Status */}
                              <div className="mb-2">
                                {getStatusBadge(order.status)}
                              </div>
                              
                              {/* Status Message */}
                              <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                                {(order.status || '').toLowerCase() === 'delivered'
                                  ? 'Your item has been delivered'
                                  : (order.status || '').toLowerCase() === 'cancelled'
                                  ? 'Your order has been cancelled'
                                  : (order.status || '').toLowerCase() === 'refunded'
                                  ? 'Your order has been returned'
                                  : 'Your order is being processed'}
                              </p>

                              {/* Action Buttons - Show for first product only */}
                              {productIndex === 0 && (
                                <div className="flex flex-col gap-1.5 items-end">
                                  {(order.status || '').toLowerCase() === 'delivered' && (
                                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                      <span style={{ fontFamily: 'Inter, sans-serif' }}>⭐ Rate & Review</span>
                                    </button>
                                  )}

                                  {order.id && (
                                    <Link
                                      to={`/account/orders/${order.id}`}
                                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                      style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                      View Details
                                    </Link>
                                  )}

                                  {(order.status === 'shipped' || order.status === 'in-transit') && (
                                    <Link
                                      to={`/account/orders/${order.id}/track`}
                                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                      style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                      Track Order
                                    </Link>
                                  )}

                                  {isCancellable(order.status) && (
                                    <button
                                      onClick={() => handleCancelOrder(order.id)}
                                      disabled={cancelingId === order.id}
                                      className={`text-sm text-red-600 hover:text-red-800 font-medium ${
                                        cancelingId === order.id ? 'opacity-50 cursor-not-allowed' : ''
                                      }`}
                                      style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                      {cancelingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Order Footer - Total */}
                        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-between">
                          <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Order #{order.orderNumber}
                          </span>
                          <span className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Total: ₹{(order.total || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
