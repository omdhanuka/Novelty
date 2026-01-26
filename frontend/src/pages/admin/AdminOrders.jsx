import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { 
  Search, Filter, Download, Eye, Edit, X, Check, Package, 
  Truck, Ban, RotateCcw, FileText, Printer, ChevronLeft, ChevronRight,
  AlertCircle, DollarSign, CreditCard, Smartphone
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminOrders = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Bulk selection
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Quick stats
  const { data: stats } = useQuery({
    queryKey: ['admin-orders-stats'],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const { data } = await api.get('/admin/orders/stats/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  // Orders query
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders', page, pageSize, orderStatus, paymentStatus, paymentMethod, search, dateFrom, dateTo],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page,
        limit: pageSize,
        ...(orderStatus && { status: orderStatus }),
        ...(paymentStatus && { paymentStatus }),
        ...(paymentMethod && { paymentMethod }),
        ...(search && { search }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      });
      
      const { data } = await api.get(`/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ orderIds, status }) => {
      const token = localStorage.getItem('adminToken');
      await api.patch('/admin/orders/bulk/status', { orderIds, status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders']);
      setSelectedOrders([]);
      setSelectAll(false);
      alert('Bulk update successful!');
    },
    onError: () => {
      alert('Bulk update failed!');
    },
  });

  // Quick status update mutation
  const quickUpdateMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const token = localStorage.getItem('adminToken');
      await api.patch(`/admin/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders']);
    },
  });

  // Export function
  const exportOrders = async (format) => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        ...(orderStatus && { status: orderStatus }),
        ...(paymentStatus && { paymentStatus }),
        ...(paymentMethod && { paymentMethod }),
        ...(search && { search }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
        format,
      });
      
      const response = await api.get(`/admin/orders/export?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        ...(format === 'csv' && { responseType: 'blob' }),
      });
      
      if (format === 'csv') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        // For XLSX, convert JSON to Excel manually
        const orders = response.data.data;
        const csvRows = [];
        csvRows.push([
          'Order Number',
          'Customer Name',
          'Customer Email',
          'Phone',
          'Order Status',
          'Payment Status',
          'Payment Method',
          'Total Amount',
          'Order Date',
        ].join(','));

        orders.forEach(order => {
          csvRows.push([
            order.orderNumber || order._id,
            order.user?.name || 'N/A',
            order.user?.email || 'N/A',
            order.user?.phone || order.shippingAddress?.phone || 'N/A',
            order.orderStatus,
            order.paymentStatus || 'pending',
            order.paymentMethod,
            order.totalPrice,
            new Date(order.createdAt).toLocaleDateString(),
          ].join(','));
        });

        const csv = csvRows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed! Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800' },
      processing: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      packed: { bg: 'bg-purple-100', text: 'text-purple-800' },
      shipped: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
      returned: { bg: 'bg-orange-100', text: 'text-orange-800' },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-800' },
    };
    const config = badges[status?.toLowerCase()] || badges.pending;
    return `${config.bg} ${config.text}`;
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      paid: { bg: 'bg-green-100', text: 'text-green-800' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      failed: { bg: 'bg-red-100', text: 'text-red-800' },
    };
    const config = badges[status?.toLowerCase()] || badges.pending;
    return `${config.bg} ${config.text}`;
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(data?.data?.map(order => order._id) || []);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleBulkStatusUpdate = (status) => {
    if (selectedOrders.length === 0) {
      alert('Please select orders first!');
      return;
    }
    if (confirm(`Update ${selectedOrders.length} orders to ${status}?`)) {
      bulkUpdateMutation.mutate({ orderIds: selectedOrders, status });
    }
  };

  const clearFilters = () => {
    setOrderStatus('');
    setPaymentStatus('');
    setPaymentMethod('');
    setSearch('');
    setDateFrom('');
    setDateTo('');
  };

  const getOrderPriorityBadge = (order) => {
    if (order.totalPrice > 10000) {
      return <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded">High Value</span>;
    }
    if (order.paymentMethod === 'COD') {
      return <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">COD</span>;
    }
    return null;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track all customer orders</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportOrders('csv')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={() => exportOrders('xlsx')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FileText size={18} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {stats?.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.data.byStatus?.reduce((sum, s) => sum + s.count, 0) || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.data.byStatus?.find(s => s._id === 'pending')?.count || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Processing</p>
            <p className="text-2xl font-bold text-indigo-600">
              {stats.data.byStatus?.find(s => ['confirmed', 'processing', 'packed'].includes(s._id))?.count || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Delivered</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.data.byStatus?.find(s => s._id === 'delivered')?.count || 0}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order #, customer name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Order Status Filter */}
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Payment Method Filter */}
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Payment Methods</option>
            <option value="COD">Cash on Delivery</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="NetBanking">Net Banking</option>
            <option value="Wallet">Wallet</option>
          </select>

          {/* Date From */}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="From Date"
          />

          {/* Date To */}
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="To Date"
          />

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg mb-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-indigo-900">
              {selectedOrders.length} order(s) selected
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatusUpdate('confirmed')}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Mark Confirmed
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('packed')}
                className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
              >
                Mark Packed
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('shipped')}
                className="px-3 py-1.5 bg-cyan-600 text-white text-sm rounded-md hover:bg-cyan-700"
              >
                Mark Shipped
              </button>
              <button
                onClick={() => exportOrders('csv')}
                className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
              >
                Export Selected
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.data?.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => handleSelectOrder(order._id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          #{order.orderNumber || order._id?.slice(-8)}
                          {getOrderPriorityBadge(order)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items?.length} items
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.user?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.user?.email || 'N/A'}</div>
                        {order.user?.phone && (
                          <div className="text-xs text-gray-400">{order.user.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ₹{(order.totalPrice || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusBadge(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                        <div className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/orders/${order._id}`)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="text-gray-600 hover:text-gray-900"
                            title="Print Invoice"
                          >
                            <Printer size={16} />
                          </button>
                          {order.orderStatus !== 'cancelled' && (
                            <button
                              onClick={() => {
                                if (confirm('Cancel this order?')) {
                                  quickUpdateMutation.mutate({ id: order._id, status: 'cancelled' });
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Cancel Order"
                            >
                              <Ban size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span> of{' '}
                    <span className="font-medium">{data?.totalPages || 1}</span>
                  </p>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="text-sm border-gray-300 rounded-md"
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {page} of {data?.totalPages || 1}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= (data?.totalPages || 1)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
