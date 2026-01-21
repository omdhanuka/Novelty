import { useAuth } from '../../context/AuthContext';
import { Package, Truck, Heart, Wallet, ShoppingBag, Eye, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const { user } = useAuth();

  // Mock data - replace with real API calls
  const stats = [
    { icon: Package, label: 'Total Orders', value: '12', color: 'bg-blue-500', link: '/account/orders' },
    { icon: Truck, label: 'In Transit', value: '2', color: 'bg-yellow-500', link: '/account/orders' },
    { icon: Heart, label: 'Wishlist', value: '5', color: 'bg-pink-500', link: '/account/wishlist' },
    { icon: Wallet, label: 'Total Spent', value: '₹18,450', color: 'bg-green-500', link: '/account/orders' },
  ];

  const recentOrders = [
    {
      id: '#ORD-2024-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: '₹2,499',
      items: 3,
      statusColor: 'text-green-600 bg-green-50',
    },
    {
      id: '#ORD-2024-002',
      date: '2024-01-18',
      status: 'Shipped',
      total: '₹3,999',
      items: 2,
      statusColor: 'text-blue-600 bg-blue-50',
    },
    {
      id: '#ORD-2024-003',
      date: '2024-01-20',
      status: 'Pending',
      total: '₹1,799',
      items: 1,
      statusColor: 'text-yellow-600 bg-yellow-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl font-bold">{user?.name?.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Hello, {user?.name}! 👋</h1>
            <p className="text-indigo-100 mt-1">Welcome back to your account</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={stat.link}
              className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              to="/account/orders"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {recentOrders.map((order) => (
            <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center">
                    <ShoppingBag size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.date} • {order.items} items</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.statusColor}`}>
                    {order.status}
                  </span>
                  <p className="font-semibold text-gray-900">{order.total}</p>
                  <Link
                    to={`/account/orders/${order.id}`}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Eye size={18} className="text-gray-600" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recentOrders.length === 0 && (
          <div className="p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ShoppingBag size={18} />
              Start Shopping
            </Link>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/account/profile"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <FileText size={20} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Update Profile</h3>
              <p className="text-sm text-gray-500">Edit your personal info</p>
            </div>
          </div>
        </Link>

        <Link
          to="/account/addresses"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Package size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Addresses</h3>
              <p className="text-sm text-gray-500">Add or edit addresses</p>
            </div>
          </div>
        </Link>

        <Link
          to="/account/wishlist"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors">
              <Heart size={20} className="text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">My Wishlist</h3>
              <p className="text-sm text-gray-500">View saved items</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
