import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Download, Eye, Edit, X, Check, Package, 
  Truck, Ban, RotateCcw, FileText, Printer, ChevronLeft, ChevronRight,
  AlertCircle, DollarSign, CreditCard, Smartphone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';

const AdminOrderDetails = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [trackingInfo, setTrackingInfo] = useState({ trackingId: '', courierName: '' });
  
  // Get order ID from URL
  const orderId = window.location.pathname.split('/').pop();

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await api.get(`/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await api.patch(`/admin/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchOrder();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      const token = localStorage.getItem('adminToken');
      await api.post(`/admin/orders/${orderId}/notes`,
        { message: newNote },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setNewNote('');
      fetchOrder();
    } catch (error) {
      alert('Failed to add note');
    }
  };

  const addTracking = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await api.patch(`/admin/orders/${orderId}/tracking`,
        trackingInfo,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setTrackingInfo({ trackingId: '', courierName: '' });
      fetchOrder();
    } catch (error) {
      alert('Failed to add tracking');
    }
  };

  const downloadInvoice = () => {
    // Generate simple invoice HTML
    const invoiceWindow = window.open('', '_blank');
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${order.orderNumber || order._id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .invoice-details { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f4f4f4; }
          .total { text-align: right; font-weight: bold; font-size: 18px; }
          .company-info { margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <div class="company-info">
          <h1>Your Company Name</h1>
          <p>Address Line 1, City, State - PIN</p>
          <p>Email: info@company.com | Phone: +91 1234567890</p>
        </div>
        
        <div class="header">
          <h2>INVOICE</h2>
          <p>Order #${order.orderNumber || order._id}</p>
          <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div class="invoice-details">
          <h3>Bill To:</h3>
          <p><strong>${order.shippingAddress?.name || order.shippingAddress?.fullName}</strong></p>
          <p>${order.shippingAddress?.addressLine || order.shippingAddress?.addressLine1}</p>
          <p>${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}</p>
          <p>Phone: ${order.shippingAddress?.phone}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || []).map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="text-align: right; margin-top: 20px;">
          <p>Subtotal: ₹${(order.itemsPrice || 0).toLocaleString()}</p>
          <p>Shipping: ₹${(order.shippingPrice || 0).toLocaleString()}</p>
          <p>Tax (GST): ₹${(order.taxPrice || 0).toLocaleString()}</p>
          ${order.discount > 0 ? `<p>Discount: -₹${order.discount.toLocaleString()}</p>` : ''}
          <p class="total">Total: ₹${(order.totalPrice || 0).toLocaleString()}</p>
        </div>
        
        <div style="margin-top: 40px; border-top: 2px solid #000; padding-top: 20px;">
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Payment Status:</strong> ${order.paymentStatus || 'pending'}</p>
        </div>
      </body>
      </html>
    `;
    
    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmed' },
      processing: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Processing' },
      packed: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Packed' },
      shipped: { bg: 'bg-cyan-100', text: 'text-cyan-800', label: 'Shipped' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Refunded' },
      returned: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Returned' },
    };
    const config = badges[status?.toLowerCase()] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      paid: { bg: 'bg-green-100', text: 'text-green-800' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      failed: { bg: 'bg-red-100', text: 'text-red-800' },
    };
    const config = badges[status?.toLowerCase()] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="mt-4 text-indigo-600 hover:text-indigo-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft size={20} />
          Back to Orders
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.orderNumber || order._id}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Printer size={18} />
              Print Invoice
            </button>
            <button 
              onClick={downloadInvoice}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download size={18} />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Status and Payment Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Order Status</p>
          <div className="flex items-center justify-between">
            {getStatusBadge(order.orderStatus)}
            <select
              value={order.orderStatus}
              onChange={(e) => updateOrderStatus(e.target.value)}
              className="ml-2 text-sm border-gray-300 rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Payment Status</p>
          <div className="flex items-center gap-2">
            {getPaymentStatusBadge(order.paymentStatus)}
            <span className="text-sm text-gray-600">via {order.paymentMethod}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900">
            ₹{(order.totalPrice || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            {['overview', 'timeline', 'notes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Information */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Name:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {order.user?.name || 'Guest'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {order.user?.email || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Phone:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {order.user?.phone || order.shippingAddress?.phone || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress?.name || order.shippingAddress?.fullName}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {order.shippingAddress?.addressLine || order.shippingAddress?.addressLine1}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Phone: {order.shippingAddress?.phone}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {(order.items || []).map((item, idx) => {
                      // Get image URL with comprehensive fallbacks
                      const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Cg transform='translate(100 100)'%3E%3Crect x='-30' y='-45' width='60' height='60' fill='%23d1d5db' rx='3'/%3E%3Ccircle cx='0' cy='-25' r='8' fill='%239ca3af'/%3E%3Cpath d='M -18 -12 L -8 -22 L 3 -12 L 18 -25 L 18 0 L -18 0 Z' fill='%239ca3af'/%3E%3C/g%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='12' x='100' y='140' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                      let imageUrl = placeholderSvg;
                      
                      if (item.image && item.image.trim() !== '') {
                        imageUrl = item.image;
                      } else if (item.product?.mainImage && item.product.mainImage.trim() !== '') {
                        imageUrl = item.product.mainImage;
                      } else if (item.product?.images && Array.isArray(item.product.images) && item.product.images.length > 0) {
                        const firstImage = item.product.images[0];
                        imageUrl = typeof firstImage === 'object' ? (firstImage?.url || placeholderSvg) : firstImage;
                      }
                      
                      // Convert relative URL to absolute URL
                      if (imageUrl && !imageUrl.startsWith('data:image') && !imageUrl.startsWith('http')) {
                        const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
                        imageUrl = `http://localhost:5000${cleanPath}`;
                      }
                      
                      const selectedColor = item.selectedColor || null;
                      const selectedSize = item.selectedSize || null;
                      
                      return (
                        <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-20 h-20 shrink-0">
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
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
                            <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                            {selectedColor && (
                              <p className="text-sm text-gray-500">
                                Color: <span className="font-medium">{selectedColor}</span>
                              </p>
                            )}
                            {selectedSize && (
                              <p className="text-sm text-gray-500">
                                Size: <span className="font-medium">{selectedSize}</span>
                              </p>
                            )}
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-gray-900">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{(order.itemsPrice || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">₹{(order.shippingPrice || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (GST)</span>
                      <span className="font-medium">₹{(order.taxPrice || 0).toLocaleString()}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">-₹{order.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-lg text-gray-900">
                          ₹{(order.totalPrice || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery & Tracking</h3>
                  {order.trackingId ? (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Courier:</span>
                        <span className="font-medium">{order.courierName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tracking ID:</span>
                        <span className="font-medium font-mono">{order.trackingId}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Tracking ID"
                        value={trackingInfo.trackingId}
                        onChange={(e) => setTrackingInfo({ ...trackingInfo, trackingId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Courier Name"
                        value={trackingInfo.courierName}
                        onChange={(e) => setTrackingInfo({ ...trackingInfo, courierName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <button
                        onClick={addTracking}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                      >
                        Add Tracking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {(order.statusHistory || []).map((entry, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Package size={20} className="text-indigo-600" />
                    </div>
                    {idx < order.statusHistory.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-200"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{entry.status}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.updatedAt || entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add internal note..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button
                  onClick={addNote}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                >
                  Add Note
                </button>
              </div>

              <div className="space-y-3 mt-6">
                {(order.notes || []).map((note, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">{note.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
