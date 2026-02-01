import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Home,
  User,
  Phone,
  ChevronRight,
  Download,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Circle,
  Package,
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { api } from '../../lib/api';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/user/orders/${orderId}`);
      if (response.data.success) {
        const orderData = response.data.data;
        
        // Normalize image URLs
        if (orderData.items) {
          orderData.items = orderData.items.map(item => {
            let imageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3C/svg%3E";
            
            if (item.image && item.image.trim() !== '') {
              imageUrl = item.image;
            } else if (item.product?.mainImage && item.product.mainImage.trim() !== '') {
              imageUrl = item.product.mainImage;
            } else if (item.product?.images && Array.isArray(item.product.images) && item.product.images.length > 0) {
              const firstImage = item.product.images[0];
              imageUrl = typeof firstImage === 'object' ? (firstImage?.url || imageUrl) : firstImage;
            }
            
            // Convert relative URL to absolute URL
            if (imageUrl && !imageUrl.startsWith('data:image') && !imageUrl.startsWith('http')) {
              const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
              imageUrl = `http://localhost:5000${cleanPath}`;
            }
            
            return { ...item, normalizedImage: imageUrl };
          });
        }
        
        setOrder(orderData);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Loading order details...
            </p>
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
        <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center py-20">
          <div className="text-center">
            <Package size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              We couldn't find the order you're looking for.
            </p>
            <Link
              to="/account/orders"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
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

  // Get timeline stages
  const getOrderTimeline = () => {
    const statusLower = (order.orderStatus || '').toLowerCase();
    
    if (['cancelled', 'refunded'].includes(statusLower)) {
      return [
        {
          label: 'Order Confirmed',
          completed: true,
          timestamp: order.statusHistory?.find(h => h.status === 'placed')?.timestamp || order.createdAt,
        },
        {
          label: statusLower === 'cancelled' ? 'Order Cancelled' : 'Order Refunded',
          completed: true,
          timestamp: order.statusHistory?.find(h => h.status === statusLower)?.timestamp,
        },
      ];
    }

    const allStages = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];
    const currentIndex = allStages.indexOf(statusLower);

    const stageLabels = {
      placed: 'Order Placed',
      confirmed: 'Order Confirmed',
      packed: 'Packed',
      shipped: 'Shipped',
      delivered: 'Delivered',
    };

    return allStages
      .filter((_, idx) => idx <= Math.max(currentIndex, 1))
      .map((stage, idx) => {
        const historyEntry = order.statusHistory?.find(h => h.status === stage);
        return {
          label: stageLabels[stage],
          completed: idx <= currentIndex,
          timestamp: historyEntry?.timestamp,
        };
      });
  };

  const timeline = getOrderTimeline();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F1F3F6] py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight size={16} />
            <Link to="/account/orders" className="hover:text-blue-600">My Orders</Link>
            <ChevronRight size={16} />
            <span className="text-gray-900">{order.orderNumber}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Product Details */}
            <div className="lg:col-span-2 space-y-4">
              {/* Product Cards */}
              {order.items?.map((item, index) => (
                <div key={index} className="bg-white rounded-sm shadow-sm p-6">
                  <div className="flex gap-6 mb-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 shrink-0">
                      <img
                        src={item.normalizedImage}
                        alt={item.name || item.product?.name}
                        className="w-full h-full object-cover border border-gray-200"
                        onError={(e) => {
                          const placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3C/svg%3E";
                          if (!e.target.src.startsWith('data:image')) {
                            e.target.src = placeholder;
                          }
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-base font-normal text-gray-900 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {item.name || item.product?.name || 'Product'}
                      </h3>
                      
                      {item.variant && (
                        <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {item.variant.color && `Color: ${item.variant.color}`}
                          {item.variant.size && ` | Size: ${item.variant.size}`}
                        </p>
                      )}
                      
                      <p className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Seller: {order.seller || 'Novelty'}
                      </p>
                      
                      <p className="text-lg font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        ₹{item.price?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  {index === 0 && (
                    <div className="border-t border-gray-200 pt-6">
                      <div className="space-y-4 mb-4">
                        {timeline.map((stage, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            {stage.completed ? (
                              <CheckCircle2 size={20} className="text-green-600 mt-0.5 shrink-0" />
                            ) : (
                              <Circle size={20} className="text-gray-300 mt-0.5 shrink-0" />
                            )}
                            <div>
                              <p className={`text-sm font-medium ${stage.completed ? 'text-gray-900' : 'text-gray-400'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                                {stage.label}
                                {stage.timestamp && stage.completed && (
                                  <span className="text-gray-500 font-normal ml-2">
                                    {new Date(stage.timestamp).toLocaleDateString('en-IN', {
                                      month: 'short',
                                      day: '2-digit',
                                      year: 'numeric',
                                    })}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Link
                        to={`/account/orders/${order._id}/track`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        See All Updates
                        <ChevronRight size={16} />
                      </Link>

                      {/* Chat Button */}
                      <button className="mt-4 w-full py-2.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <MessageCircle size={18} />
                        Chat with us
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Order Number */}
              <div className="bg-white rounded-sm shadow-sm px-6 py-3">
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Order #{order.orderNumber}
                </p>
              </div>
            </div>

            {/* Right Column - Delivery & Price Details */}
            <div className="space-y-4">
              {/* Delivery Details */}
              <div className="bg-white rounded-sm shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Delivery details
                </h3>

                {/* Address */}
                <div className="flex items-start gap-3 mb-4">
                  <Home size={20} className="text-gray-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Home
                    </p>
                    <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {order.shippingAddress?.addressLine1}
                      {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                      {order.shippingAddress?.landmark && `, ${order.shippingAddress.landmark}`}
                    </p>
                    {order.shippingAddress?.city && (
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="flex items-center gap-3 mb-3">
                  <User size={20} className="text-gray-600 shrink-0" />
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {order.shippingAddress?.fullName || order.user?.name || 'Customer'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-gray-600 shrink-0" />
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {order.shippingAddress?.phone || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Price Details */}
              <div className="bg-white rounded-sm shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Price details
                </h3>

                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span className="text-gray-600">Listing price</span>
                    <span className="text-gray-900">₹{((order.totalPrice || 0) + (order.discount || 0)).toLocaleString('en-IN')}</span>
                  </div>
                  
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span className="text-gray-600">Discount</span>
                      <span className="text-green-600">-₹{order.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span className="text-gray-600">Special price</span>
                    <span className="text-gray-900">₹{(order.totalPrice - (order.deliveryCharge || 0) - (order.tax || 0)).toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span className="text-gray-600">Total fees</span>
                    <span className="text-gray-900">₹{((order.deliveryCharge || 0) + (order.tax || 0)).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex justify-between text-base font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="text-gray-900">Total amount</span>
                  <span className="text-gray-900">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                </div>

                {/* Payment Method */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span className="text-gray-600">Payment method</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium">
                        {order.paymentMethod === 'cod' ? 'Cash On Delivery' : order.paymentMethod?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Download Invoice */}
                <button className="mt-4 w-full py-2.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <Download size={18} />
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetails;

