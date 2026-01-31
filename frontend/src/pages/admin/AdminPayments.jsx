import { useState, useEffect } from 'react';
import { Search, Filter, Eye, DollarSign, CreditCard, TrendingUp, AlertCircle, CheckCircle, XCircle, Clock, Calendar, Download, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Fetch payments (from orders)
  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (statusFilter !== 'all') {
        params.paymentStatus = statusFilter;
      }

      if (methodFilter !== 'all') {
        params.paymentMethod = methodFilter;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      // Get orders with payment info
      const response = await api.get('/admin/orders', { params });
      
      if (response.data.success) {
        const orders = response.data.data;
        
        // Transform orders to payment format
        const paymentData = orders.map(order => ({
          _id: order._id,
          orderId: order._id,
          orderNumber: order._id.slice(-8).toUpperCase(),
          customerName: order.shippingAddress?.name || order.user?.name || 'N/A',
          customerEmail: order.user?.email || 'N/A',
          amount: order.totalPrice || 0,
          paymentMethod: order.paymentMethod || 'N/A',
          paymentStatus: order.paymentStatus || 'pending',
          paymentInfo: order.paymentInfo || {},
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        }));

        setPayments(paymentData);
        setPagination(response.data.pagination);

        // Calculate stats
        calculateStats(paymentData);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      alert('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (paymentData) => {
    const stats = {
      totalRevenue: paymentData
        .filter(p => p.paymentStatus === 'paid')
        .reduce((sum, p) => sum + p.amount, 0),
      successfulPayments: paymentData.filter(p => p.paymentStatus === 'paid').length,
      pendingPayments: paymentData.filter(p => p.paymentStatus === 'pending').length,
      failedPayments: paymentData.filter(p => p.paymentStatus === 'failed').length,
    };
    setStats(stats);
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchPayments();
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchQuery, statusFilter, methodFilter, dateRange, pagination.page]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status icon and color
  const getStatusDisplay = (status) => {
    const displays = {
      paid: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Paid',
      },
      pending: {
        icon: Clock,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        label: 'Pending',
      },
      failed: {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Failed',
      },
      refunded: {
        icon: RefreshCw,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        label: 'Refunded',
      },
    };
    return displays[status] || displays.pending;
  };

  // Get payment method display
  const getMethodDisplay = (method) => {
    const displays = {
      razorpay: { label: 'Razorpay', color: 'bg-blue-100 text-blue-800' },
      cod: { label: 'Cash on Delivery', color: 'bg-green-100 text-green-800' },
      card: { label: 'Card', color: 'bg-purple-100 text-purple-800' },
      upi: { label: 'UPI', color: 'bg-orange-100 text-orange-800' },
    };
    return displays[method?.toLowerCase()] || { label: method || 'N/A', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
        <p className="text-gray-600">Track and manage all payment transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Successful Payments</p>
          <p className="text-3xl font-bold">{stats.successfulPayments}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Pending Payments</p>
          <p className="text-3xl font-bold">{stats.pendingPayments}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Failed Payments</p>
          <p className="text-3xl font-bold">{stats.failedPayments}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Method Filter */}
          <div>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Methods</option>
              <option value="razorpay">Razorpay</option>
              <option value="cod">Cash on Delivery</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">No payments found</p>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map((payment) => {
                    const statusDisplay = getStatusDisplay(payment.paymentStatus);
                    const methodDisplay = getMethodDisplay(payment.paymentMethod);
                    const StatusIcon = statusDisplay.icon;

                    return (
                      <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-mono font-semibold text-gray-900">
                              #{payment.orderNumber}
                            </p>
                            {payment.paymentInfo?.razorpayPaymentId && (
                              <p className="text-xs text-gray-500 mt-1">
                                {payment.paymentInfo.razorpayPaymentId.slice(0, 20)}...
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{payment.customerName}</p>
                            <p className="text-sm text-gray-500">{payment.customerEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 text-lg">
                            {formatCurrency(payment.amount)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${methodDisplay.color}`}>
                            <CreditCard className="w-3 h-3 mr-1" />
                            {methodDisplay.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.bg} ${statusDisplay.text}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusDisplay.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {formatDate(payment.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => window.open(`/admin/orders/${payment.orderId}`, '_blank')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Order"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} payments
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination({ ...pagination, page: pageNum })}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            pagination.page === pageNum
                              ? 'bg-purple-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Payment Methods Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods Breakdown</h3>
          <div className="space-y-3">
            {['razorpay', 'cod'].map(method => {
              const count = payments.filter(p => p.paymentMethod?.toLowerCase() === method).length;
              const total = payments.filter(p => p.paymentMethod?.toLowerCase() === method && p.paymentStatus === 'paid')
                .reduce((sum, p) => sum + p.amount, 0);
              const methodDisplay = getMethodDisplay(method);
              
              return (
                <div key={method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{methodDisplay.label}</p>
                      <p className="text-sm text-gray-500">{count} transactions</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">{formatCurrency(total)}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {payments.slice(0, 5).map(payment => {
              const statusDisplay = getStatusDisplay(payment.paymentStatus);
              const StatusIcon = statusDisplay.icon;
              
              return (
                <div key={payment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-5 h-5 ${statusDisplay.color}`} />
                    <div>
                      <p className="font-medium text-gray-900">#{payment.orderNumber}</p>
                      <p className="text-sm text-gray-500">{payment.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
