import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Package, Truck, CheckCircle, X
} from 'lucide-react';
import { api } from '../../lib/api';

const AdminOrderDetails = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  
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

  const cancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    await updateOrderStatus('cancelled');
  };

  const markAsShipped = async () => {
    await updateOrderStatus('shipped');
  };

  const getStatusStep = (status) => {
    const statusMap = {
      'placed': 1,
      'pending': 1,
      'confirmed': 1,
      'processing': 2,
      'packed': 2,
      'shipped': 3,
      'delivered': 4,
      'cancelled': 0,
      'refunded': 0,
    };
    return statusMap[status?.toLowerCase()] || 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Order not found</p>
          <button
            onClick={() => navigate('/admin/orders')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ChevronLeft size={20} />
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const currentStep = getStatusStep(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Blue Header Bar */}
      <div className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/orders')}
              className="hover:bg-blue-700 p-2 rounded transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-semibold">Order Details</h1>
          </div>
          <div className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm">
            Order ID: #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Customer and Order Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Customer Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex">
                <span className="text-gray-600 w-24">Name:</span>
                <span className="font-medium text-gray-900">{order.user?.name || order.shippingAddress?.name || order.shippingAddress?.fullName || 'Guest'}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-24">Email:</span>
                <a href={`mailto:${order.user?.email}`} className="font-medium text-blue-600 hover:underline">
                  {order.user?.email || 'N/A'}
                </a>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-24">Phone:</span>
                <span className="font-medium text-gray-900">{order.user?.phone || order.shippingAddress?.phone || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-24">Address:</span>
                <span className="font-medium text-gray-900">
                  {order.shippingAddress?.addressLine || order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}, India
                </span>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Order Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Placed On:</span>
                <span className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Mode:</span>
                <span className="font-medium text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${
                  order.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : order.paymentStatus === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus || 'Pending'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Status:</span>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${
                  order.orderStatus === 'delivered' 
                    ? 'bg-green-100 text-green-800' 
                    : order.orderStatus === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : order.orderStatus === 'shipped'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        {order.orderStatus !== 'cancelled' && order.orderStatus !== 'refunded' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="relative">
              {/* Progress Bar */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                ></div>
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((label, idx) => {
                  const stepNum = idx + 1;
                  const isCompleted = stepNum <= currentStep;
                  const isCurrent = stepNum === currentStep;

                  return (
                    <div key={idx} className="flex flex-col items-center" style={{ width: '25%' }}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold z-10 transition-all ${
                        isCompleted 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle size={24} />
                        ) : (
                          stepNum === 2 ? <Package size={20} /> :
                          stepNum === 3 ? <Truck size={20} /> :
                          stepNum === 4 ? <CheckCircle size={20} /> :
                          <CheckCircle size={20} />
                        )}
                      </div>
                      <p className={`text-sm mt-2 font-medium text-center ${
                        isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Ordered Items and Price Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ordered Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Ordered Items</h2>
              </div>
              
              {/* Table Header */}
              <div className="px-6 py-3 bg-gray-50 border-b">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                  <div className="col-span-6">Item</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y">
                {(order.items || []).map((item, idx) => {
                  const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23f3f4f6' width='80' height='80'/%3E%3Ctext fill='%239ca3af' font-size='10' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                  let imageUrl = placeholderSvg;
                  
                  if (item.image && item.image.trim() !== '') {
                    imageUrl = item.image;
                  } else if (item.product?.mainImage && item.product.mainImage.trim() !== '') {
                    imageUrl = item.product.mainImage;
                  } else if (item.product?.images && Array.isArray(item.product.images) && item.product.images.length > 0) {
                    const firstImage = item.product.images[0];
                    imageUrl = typeof firstImage === 'object' ? (firstImage?.url || placeholderSvg) : firstImage;
                  }
                  
                  if (imageUrl && !imageUrl.startsWith('data:image') && !imageUrl.startsWith('http')) {
                    const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
                    imageUrl = `http://localhost:5000${cleanPath}`;
                  }

                  return (
                    <div key={idx} className="px-6 py-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-6 flex items-center gap-3">
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-75 transition"
                            onClick={() => setSelectedImage({ url: imageUrl, name: item.name })}
                            onError={(e) => {
                              if (!e.target.src.startsWith('data:image')) {
                                e.target.src = placeholderSvg;
                              }
                            }}
                          />
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                            {(item.selectedColor || item.selectedSize) && (
                              <p className="text-xs text-gray-500 mt-1">
                                {item.selectedColor && `Color: ${item.selectedColor}`}
                                {item.selectedColor && item.selectedSize && ' · '}
                                {item.selectedSize && `Size: ${item.selectedSize}`}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="col-span-2 text-center text-sm font-medium text-gray-900">
                          {item.quantity}
                        </div>
                        <div className="col-span-2 text-right text-sm text-gray-700">
                          ₹{item.price?.toLocaleString()}
                        </div>
                        <div className="col-span-2 text-right text-sm font-semibold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total at bottom */}
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="flex justify-end">
                  <div className="text-right">
                    <span className="text-gray-600 text-lg">Total: </span>
                    <span className="text-2xl font-bold text-gray-900">₹{(order.totalPrice || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Price Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">₹{(order.itemsPrice || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold text-gray-900">₹{(order.shippingPrice || 0).toLocaleString()}</span>
                </div>
                {order.taxPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (GST):</span>
                    <span className="font-semibold text-gray-900">₹{(order.taxPrice || 0).toLocaleString()}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span className="font-semibold">-₹{order.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-3 border-t-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-gray-900">₹{(order.totalPrice || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Info (if available) */}
            {order.trackingId && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Tracking Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Courier:</span>
                    <span className="font-semibold text-gray-900">{order.courierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking ID:</span>
                    <span className="font-mono font-semibold text-blue-600">{order.trackingId}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
          <div className="flex justify-center gap-4 pb-6">
            {order.orderStatus !== 'shipped' && (
              <button
                onClick={markAsShipped}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
              >
                Mark as Shipped
              </button>
            )}
            <button
              onClick={cancelOrder}
              className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-md"
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white text-center mt-4 text-lg font-medium">
              {selectedImage.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderDetails;
