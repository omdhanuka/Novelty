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
    const config = statusConfig[key] || { label: 'Unknown', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Package };
    const Icon = config.icon || Package;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.color}`}>
        <Icon size={16} />
        {config.label}
      </span>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F7F8FC] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600 text-base md:text-lg">Track & manage your orders</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your orders...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Filters - Sticky on Mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="sticky top-0 z-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by Order ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Filter size={20} />
                      <span className="text-sm font-medium hidden sm:inline">Filter:</span>
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white font-medium text-gray-700 min-w-[150px] transition-all"
                    >
                      <option value="all">All Orders</option>
                      <option value="placed">Placed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Returned</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Orders List */}
              <AnimatePresence mode="wait">
                {filteredOrders.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 md:p-16 text-center"
                  >
                    <div className="max-w-md mx-auto">
                      <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package size={48} className="text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders found</h3>
                      <p className="text-gray-600 mb-8 text-lg">
                        {searchQuery || statusFilter !== 'all'
                          ? 'Try adjusting your search or filters'
                          : "You haven't placed any orders yet"}
                      </p>
                      {!searchQuery && statusFilter === 'all' && (
                        <Link
                          to="/products"
                          className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold shadow-lg shadow-indigo-200"
                        >
                          Start Shopping
                          <ChevronRight size={20} />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order, index) => (
                      <motion.div
                        key={order.id || order.orderNumber || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                      >
                        {/* Order Header */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Package size={28} className="text-indigo-600" />
                              </div>
                              <div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                                  #{order.orderNumber}
                                </h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                  <Clock size={14} />
                                  {new Date(order.date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:items-end gap-2">
                              {getStatusBadge(order.status)}
                              <p className="text-xl md:text-2xl font-bold text-gray-900">
                                ₹{(order.total || 0).toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                          <div className="space-y-3">
                            {order.products.slice(0, 3).map((product, idx) => (
                              <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white border border-gray-100">
                                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                                    onError={(e) => {
                                      const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Cg transform='translate(100 100)'%3E%3Crect x='-30' y='-45' width='60' height='60' fill='%23d1d5db' rx='3'/%3E%3Ccircle cx='0' cy='-25' r='8' fill='%239ca3af'/%3E%3Cpath d='M -18 -12 L -8 -22 L 3 -12 L 18 -25 L 18 0 L -18 0 Z' fill='%239ca3af'/%3E%3C/g%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='12' x='100' y='140' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                                      if (!e.target.src.startsWith('data:image')) {
                                        e.target.src = placeholderSvg;
                                      }
                                    }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 truncate text-sm md:text-base">
                                    {product.name}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Qty: <span className="font-medium text-gray-700">{product.qty}</span>
                                  </p>
                                </div>
                                <p className="font-bold text-gray-900 shrink-0 text-sm md:text-base">
                                  ₹{product.price.toLocaleString('en-IN')}
                                </p>
                              </div>
                            ))}
                            {order.products.length > 3 && (
                              <p className="text-sm text-gray-500 text-center py-2">
                                +{order.products.length - 3} more item{order.products.length - 3 > 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="p-6 border-t border-gray-100 bg-white">
                          <div className="flex flex-col sm:flex-row gap-3">
                            {order.id ? (
                              <Link
                                to={`/account/orders/${order.id}`}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl"
                              >
                                <Eye size={20} />
                                View Details
                              </Link>
                            ) : (
                              <div className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed">
                                <Eye size={20} />
                                View Details
                              </div>
                            )}
                            
                            {(order.status === 'delivered' || order.status === 'Delivered') && (
                              <>
                                <button className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold">
                                  Write Review
                                </button>
                                <button className="flex-1 px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all font-semibold">
                                  Buy Again
                                </button>
                              </>
                            )}
                            
                            {(order.status === 'shipped' || order.status === 'in-transit') && (
                              <button className="flex-1 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-semibold">
                                <Truck size={18} className="inline mr-2" />
                                Track Order
                              </button>
                            )}
                            
                            {isCancellable(order.status) && (
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={cancelingId === order.id}
                                className={`flex-1 px-6 py-3 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition-all font-semibold ${
                                  cancelingId === order.id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                title={cancelingId === order.id ? 'Cancelling...' : ''}
                              >
                                <Ban size={18} className="inline mr-2" />
                                {cancelingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              {/* Order Stats */}
              {filteredOrders.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Package size={24} className="text-gray-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900 mb-1">{normalizedOrders.length}</p>
                      <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle size={24} className="text-green-600" />
                      </div>
                      <p className="text-3xl font-bold text-green-600 mb-1">
                        {normalizedOrders.filter((o) => (o.status || '').toString().toLowerCase() === 'delivered').length}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">Delivered</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Truck size={24} className="text-purple-600" />
                      </div>
                      <p className="text-3xl font-bold text-purple-600 mb-1">
                        {normalizedOrders.filter((o) => {
                          const status = (o.status || '').toString().toLowerCase();
                          return status === 'shipped' || status === 'in-transit';
                        }).length}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">In Transit</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl font-bold text-indigo-600">₹</span>
                      </div>
                      <p className="text-3xl font-bold text-indigo-600 mb-1">
                        ₹{normalizedOrders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">Total Spent</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
