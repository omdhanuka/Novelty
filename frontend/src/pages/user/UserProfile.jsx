import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Clock, 
  User as UserIcon,
  Settings,
  ChevronRight
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { api } from '../../lib/api';

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [addressRes, ordersRes] = await Promise.all([
        api.get('/user/addresses'),
        api.get('/user/orders')
      ]);

      if (addressRes.data.success) {
        setAddresses(addressRes.data.data);
      }

      if (ordersRes.data.success) {
        setOrders(ordersRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
  const recentOrders = orders.slice(0, 2);
  const pendingOrders = orders.filter(order => 
    ['placed', 'confirmed', 'processing', 'shipped'].includes(order.orderStatus)
  ).length;

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      shipped: 'bg-blue-100 text-blue-800',
      placed: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/account')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">User Profile</span>
          </button>

          {/* Profile Header Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h1>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      <span className="text-sm">{user?.email}</span>
                    </div>
                    {user?.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} />
                        <span className="text-sm">{user?.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/account/edit-profile')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit size={16} />
                <span className="font-medium">Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <p className="text-base font-medium text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="text-base font-medium text-gray-900">{user?.email}</p>
                </div>
                {user?.phone && (
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="text-base font-medium text-gray-900">{user?.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
              {defaultAddress ? (
                <div className="space-y-2">
                  <p className="text-base font-medium text-gray-900">
                    {defaultAddress.addressLine}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
                  </p>
                  <p className="text-sm text-gray-600">Phone: {defaultAddress.phone}</p>
                </div>
              ) : (
                <p className="text-gray-500">No shipping address added</p>
              )}
            </div>
          </div>

          {/* Account Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Account Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.phone ? 'Added' : 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.gender || 'Male'}</p>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <button
                onClick={() => navigate('/account/orders')}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
              >
                View All Orders
                <ChevronRight size={16} />
              </button>
            </div>
            
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/account/orders/${order._id}`)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                          <Package size={24} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{order.orderId}</p>
                          <p className="text-sm text-gray-500">
                            Placed {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-600 text-lg">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package size={48} className="mx-auto mb-3 opacity-50" />
                <p>No orders yet</p>
              </div>
            )}
          </div>

          {/* Shipping Address Section (Bottom) */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
              <button
                onClick={() => navigate('/account/addresses')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>
            
            {defaultAddress ? (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin size={20} className="text-gray-600 shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">{defaultAddress.name || user?.name}</p>
                  <p className="text-sm text-gray-600">
                    {defaultAddress.addressLine}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Phone: {defaultAddress.phone}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/account/addresses')}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                <MapPin size={32} className="mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600">Add shipping address</p>
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
