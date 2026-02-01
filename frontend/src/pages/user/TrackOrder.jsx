import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  Truck,
  MapPin,
  Clock,
  Phone,
  Mail,
  ExternalLink,
  Box,
  ShoppingBag,
  Calendar,
  Navigation,
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { api } from '../../lib/api';

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderTracking();
  }, [orderId]);

  const fetchOrderTracking = async () => {
    try {
      const response = await api.get(`/user/orders/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const statusMap = {
      placed: ShoppingBag,
      confirmed: CheckCircle2,
      packed: Box,
      shipped: Truck,
      delivered: Package,
    };
    return statusMap[status?.toLowerCase()] || Package;
  };

  const getTrackingTimeline = () => {
    if (!order) return [];

    const allStatuses = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];
    const currentStatusLower = (order.orderStatus || '').toLowerCase();
    
    // Handle cancelled/refunded orders
    if (['cancelled', 'refunded'].includes(currentStatusLower)) {
      return [
        {
          status: 'placed',
          label: 'Order Placed',
          completed: true,
          timestamp: order.statusHistory?.find(h => h.status === 'placed')?.timestamp || order.createdAt,
        },
        {
          status: currentStatusLower,
          label: currentStatusLower === 'cancelled' ? 'Order Cancelled' : 'Order Refunded',
          completed: true,
          timestamp: order.statusHistory?.find(h => h.status === currentStatusLower)?.timestamp,
          isFinal: true,
        },
      ];
    }

    const currentIndex = allStatuses.indexOf(currentStatusLower);

    return allStatuses.map((status, idx) => {
      const historyEntry = order.statusHistory?.find(h => h.status === status);
      return {
        status,
        label: status.charAt(0).toUpperCase() + status.slice(1),
        completed: idx <= currentIndex,
        active: idx === currentIndex,
        timestamp: historyEntry?.timestamp,
        location: historyEntry?.location,
        note: historyEntry?.note,
      };
    });
  };

  const getEstimatedDelivery = () => {
    if (!order) return null;
    
    const statusLower = (order.orderStatus || '').toLowerCase();
    
    if (statusLower === 'delivered') {
      const deliveredEntry = order.statusHistory?.find(h => h.status === 'delivered');
      return {
        label: 'Delivered On',
        date: deliveredEntry?.timestamp || order.updatedAt,
        isPast: true,
      };
    }

    if (['cancelled', 'refunded'].includes(statusLower)) {
      return null;
    }

    // Calculate estimated delivery (5-7 business days from order date)
    const orderDate = new Date(order.createdAt);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + 7);

    return {
      label: 'Expected Delivery',
      date: estimatedDate,
      isPast: false,
    };
  };

  const timeline = getTrackingTimeline();
  const estimatedDelivery = getEstimatedDelivery();

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading tracking information...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center py-20">
          <div className="text-center">
            <Package size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
            <Link
              to="/account/orders"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
            >
              <ArrowLeft size={20} />
              Back to Orders
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const statusLower = (order.orderStatus || '').toLowerCase();
  const isCancelled = ['cancelled', 'refunded'].includes(statusLower);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F8F9FB] py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </motion.button>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600 text-base md:text-lg">
              Order #{order.orderNumber}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Tracking Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Status Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
                  isCancelled ? 'border-red-200' : 'border-indigo-200'
                }`}
              >
                <div
                  className={`p-6 ${
                    isCancelled
                      ? 'bg-gradient-to-br from-red-50 to-orange-50'
                      : 'bg-gradient-to-br from-indigo-50 to-purple-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                        isCancelled ? 'bg-red-100' : 'bg-indigo-100'
                      }`}
                    >
                      {React.createElement(getStatusIcon(order.orderStatus), {
                        size: 32,
                        className: isCancelled ? 'text-red-600' : 'text-indigo-600',
                      })}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {isCancelled
                          ? statusLower === 'cancelled'
                            ? 'Order Cancelled'
                            : 'Order Refunded'
                          : statusLower === 'delivered'
                          ? 'Order Delivered'
                          : `Order ${order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}`}
                      </h2>
                      <p className="text-gray-600">
                        {isCancelled
                          ? 'This order has been cancelled and any charges have been refunded.'
                          : statusLower === 'delivered'
                          ? 'Your order has been successfully delivered.'
                          : 'Your order is being processed and will be delivered soon.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tracking Number */}
                {order.trackingNumber && !isCancelled && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                        <p className="font-mono font-semibold text-gray-900">{order.trackingNumber}</p>
                      </div>
                      {order.courierLink && (
                        <a
                          href={order.courierLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          Track on Courier Site
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-8">Tracking Timeline</h3>

                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-indigo-200 to-gray-200"></div>

                  <div className="space-y-8">
                    {timeline.map((step, index) => {
                      const Icon = getStatusIcon(step.status);
                      const isCompleted = step.completed;
                      const isActive = step.active;
                      const isFinalNegative = step.isFinal;

                      return (
                        <div key={step.status} className="relative flex gap-6">
                          {/* Icon */}
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                              isFinalNegative
                                ? 'bg-red-100 border-4 border-red-500'
                                : isCompleted
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 border-4 border-indigo-100'
                                : 'bg-white border-4 border-gray-200'
                            }`}
                          >
                            <Icon
                              size={20}
                              className={
                                isFinalNegative
                                  ? 'text-red-600'
                                  : isCompleted
                                  ? 'text-white'
                                  : 'text-gray-400'
                              }
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-2">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h4
                                className={`font-semibold text-lg ${
                                  isCompleted ? 'text-gray-900' : 'text-gray-400'
                                }`}
                              >
                                {step.label}
                              </h4>
                              {step.timestamp && (
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                  <Clock size={14} />
                                  {new Date(step.timestamp).toLocaleString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </div>
                              )}
                            </div>

                            {step.location && (
                              <div className="flex items-start gap-2 text-sm text-gray-600 mb-1">
                                <MapPin size={16} className="shrink-0 mt-0.5" />
                                <span>{step.location}</span>
                              </div>
                            )}

                            {step.note && (
                              <p className="text-sm text-gray-500 mt-1">{step.note}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Estimated Delivery */}
              {estimatedDelivery && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar size={20} className="text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">{estimatedDelivery.label}</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {new Date(estimatedDelivery.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {estimatedDelivery.isPast ? 'Delivery completed' : 'Estimated delivery date'}
                  </p>
                </motion.div>
              )}

              {/* Delivery Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin size={20} className="text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Delivery Address</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="font-semibold text-gray-900">{order.shippingAddress?.fullName}</p>
                  <p>{order.shippingAddress?.addressLine1}</p>
                  {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  {order.shippingAddress?.landmark && (
                    <p className="text-gray-500">Near: {order.shippingAddress.landmark}</p>
                  )}
                  <p>
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} -{' '}
                    {order.shippingAddress?.pincode}
                  </p>
                  {order.shippingAddress?.phone && (
                    <div className="flex items-center gap-2 pt-2 text-indigo-600">
                      <Phone size={16} />
                      <span>{order.shippingAddress.phone}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Help & Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6"
              >
                <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <a
                    href="mailto:support@novelty.com"
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <Mail size={16} className="text-indigo-600" />
                    </div>
                    <span>support@novelty.com</span>
                  </a>
                  <a
                    href="tel:+911234567890"
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <Phone size={16} className="text-indigo-600" />
                    </div>
                    <span>+91 123 456 7890</span>
                  </a>
                </div>
              </motion.div>

              {/* View Full Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to={`/account/orders/${order._id}`}
                  className="block w-full px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all font-semibold text-center"
                >
                  View Full Order Details
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TrackOrder;
