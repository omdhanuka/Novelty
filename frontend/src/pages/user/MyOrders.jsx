import { useState, useEffect } from 'react';
import { Search, Filter, Package, Clock, CheckCircle, XCircle, Eye, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    'in-transit': { label: 'In Transit', color: 'bg-blue-100 text-blue-800', icon: Package },
    processing: { label: 'Processing', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
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

  const filteredOrders = normalizedOrders.filter((order) => {
    const idStr = (order.orderNumber || '').toString();
    const matchesSearch = idStr.toLowerCase().includes((searchQuery || '').toLowerCase());
    const matchesStatus = statusFilter === 'all' || (order.status || '').toString() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const key = (status || '').toString().toLowerCase();
    const config = statusConfig[key] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: Package };
    const Icon = config.icon || Package;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
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
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">Track and manage your orders</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Orders</option>
              <option value="processing">Processing</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
          >
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : "You haven't placed any orders yet"}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Shopping
                <ChevronRight size={18} />
              </Link>
            )}
          </motion.div>
        ) : (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order.id || order.orderNumber || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Package size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                    {getStatusBadge(order.status)}
                    <p className="text-lg font-bold text-gray-900">₹{(order.total || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 bg-gray-50">
                <div className="space-y-3">
                  {order.products.map((product, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-16 h-16 shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            console.log('Image load error:', e.target.src);
                            const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Cg transform='translate(100 100)'%3E%3Crect x='-30' y='-45' width='60' height='60' fill='%23d1d5db' rx='3'/%3E%3Ccircle cx='0' cy='-25' r='8' fill='%239ca3af'/%3E%3Cpath d='M -18 -12 L -8 -22 L 3 -12 L 18 -25 L 18 0 L -18 0 Z' fill='%239ca3af'/%3E%3C/g%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='12' x='100' y='140' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                            if (!e.target.src.startsWith('data:image')) {
                              e.target.src = placeholderSvg;
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {product.qty}</p>
                      </div>
                      <p className="font-semibold text-gray-900 shrink-0">₹{product.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Actions */}
              <div className="p-6 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-3">
                  {order.id ? (
                    <Link
                      to={`/account/orders/${order.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Eye size={18} />
                      View Details
                    </Link>
                  ) : (
                    <div className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg">
                      <Eye size={18} />
                      View Details
                    </div>
                  )}
                  {order.status === 'delivered' && (
                    <>
                      <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        Write Review
                      </button>
                      <button className="flex-1 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                        Buy Again
                      </button>
                    </>
                  )}
                  {order.status === 'in-transit' && (
                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      Track Order
                    </button>
                  )}
                  {order.status === 'processing' && (
                    <button className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Order Stats */}
      {filteredOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{normalizedOrders.length}</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {normalizedOrders.filter((o) => (o.status || '').toString() === 'delivered').length}
              </p>
              <p className="text-sm text-gray-500">Delivered</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {normalizedOrders.filter((o) => (o.status || '').toString() === 'in-transit').length}
              </p>
              <p className="text-sm text-gray-500">In Transit</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">
                ₹{normalizedOrders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Total Spent</p>
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
