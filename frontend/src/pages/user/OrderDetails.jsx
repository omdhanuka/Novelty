import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, MapPin, Phone, Mail, Download, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderDetails = () => {
  const { orderId } = useParams();

  // Mock order data - replace with API call
  const order = {
    id: orderId || 'ORD001234',
    orderDate: '2024-01-15',
    status: 'delivered',
    deliveryDate: '2024-01-18',
    total: 4599,
    subtotal: 4599,
    shipping: 0,
    tax: 0,
    discount: 0,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    shippingAddress: {
      name: 'John Doe',
      phone: '+91 98765 43210',
      addressLine: '123, MG Road, Brigade Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    },
    items: [
      {
        id: 1,
        name: 'Premium Leather Backpack',
        image: 'https://via.placeholder.com/100',
        price: 2599,
        qty: 1,
        sku: 'BAG-001',
      },
      {
        id: 2,
        name: 'Canvas Tote Bag',
        image: 'https://via.placeholder.com/100',
        price: 2000,
        qty: 1,
        sku: 'BAG-002',
      },
    ],
    tracking: [
      { status: 'Order Placed', date: '2024-01-15 10:30 AM', completed: true },
      { status: 'Order Confirmed', date: '2024-01-15 11:00 AM', completed: true },
      { status: 'Shipped', date: '2024-01-16 09:00 AM', completed: true },
      { status: 'Out for Delivery', date: '2024-01-18 08:00 AM', completed: true },
      { status: 'Delivered', date: '2024-01-18 02:30 PM', completed: true },
    ],
  };

  const statusConfig = {
    delivered: { color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
    'in-transit': { color: 'text-blue-600', bg: 'bg-blue-100', label: 'In Transit' },
    processing: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Processing' },
    cancelled: { color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
  };

  const currentStatus = statusConfig[order.status];

  return (
    <div className="max-w-6xl">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </Link>
      </motion.div>

      {/* Order Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{order.id}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${currentStatus.bg} ${currentStatus.color}`}>
              <CheckCircle size={18} />
              {currentStatus.label}
            </span>
            {order.status === 'delivered' && (
              <p className="text-sm text-gray-600">
                Delivered on {new Date(order.deliveryDate).toLocaleDateString('en-IN')}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Tracking</h2>
            <div className="space-y-6">
              {order.tracking.map((track, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      track.completed ? 'bg-green-500' : 'bg-gray-200'
                    }`}>
                      {track.completed ? (
                        <CheckCircle size={20} className="text-white" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    {index < order.tracking.length - 1 && (
                      <div className={`w-0.5 h-16 ${track.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <p className={`font-semibold ${track.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {track.status}
                    </p>
                    {track.date && (
                      <p className="text-sm text-gray-500 mt-1">{track.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">SKU: {item.sku}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString()}</p>
                    {order.status === 'delivered' && (
                      <Link
                        to={`/product/${item.id}/review`}
                        className="text-sm text-indigo-600 hover:text-indigo-700 mt-2 inline-block"
                      >
                        Write Review
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">-₹{order.discount.toLocaleString()}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">₹{order.tax.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900 text-lg">₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Payment Method</p>
              <p className="font-medium text-gray-900">{order.paymentMethod}</p>
              <span className="inline-flex items-center mt-2 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                {order.paymentStatus}
              </span>
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                  <p className="text-gray-600 mt-1">
                    {order.shippingAddress.addressLine}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                    {order.shippingAddress.pincode}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <p className="text-gray-600">{order.shippingAddress.phone}</p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Download size={18} />
              Download Invoice
            </button>
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <MessageCircle size={18} />
              Contact Support
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
