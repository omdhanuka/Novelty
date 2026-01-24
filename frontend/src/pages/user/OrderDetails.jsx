import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle, XCircle, Truck, Clock, MapPin, Phone, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { api } from '../../lib/api';

const OrderDetails = () => {
	const { orderId } = useParams();
	const navigate = useNavigate();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchOrder();
	}, [orderId]);

	const fetchOrder = async () => {
		try {
			const response = await api.get(`/user/orders/${orderId}`);
			if (response.data.success) {
				setOrder(response.data.data);
			} else {
				setError(response.data.message || 'Failed to load order');
			}
		} catch (error) {
			console.error('Error fetching order:', error);
			setError(error.response?.data?.message || 'Failed to load order');
		} finally {
			setLoading(false);
		}
	};

	const getStatusBadge = (status) => {
		const statusMap = {
			pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
			processing: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Processing' },
			shipped: { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Shipped' },
			delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
			cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
		};
		
		const statusKey = (status || 'pending').toString().toLowerCase();
		const config = statusMap[statusKey] || statusMap.pending;
		const Icon = config.icon;
		
		return (
			<span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${config.bg} ${config.color}`}>
				<Icon size={18} />
				{config.label}
			</span>
		);
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

	if (error || !order) {
		return (
			<>
				<Header />
				<div className="min-h-screen bg-gray-50 flex items-center justify-center">
					<div className="text-center">
						<Package size={48} className="mx-auto text-gray-300 mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 mb-2">
							{error || 'Order Not Found'}
						</h2>
						<Link to="/orders" className="text-indigo-600 hover:text-indigo-700">
							Back to Orders
						</Link>
					</div>
				</div>
				<Footer />
			</>
		);
	}

	return (
		<>
			<Header />
			<div className="min-h-screen bg-gray-50 py-12">
				<div className="max-w-5xl mx-auto px-4">
					{/* Back Button */}
					<motion.div 
						initial={{ opacity: 0, x: -20 }} 
						animate={{ opacity: 1, x: 0 }} 
						className="mb-6"
					>
						<Link 
							to="/orders" 
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
								<h1 className="text-2xl font-bold text-gray-900 mb-2">
									Order #{order.orderNumber || order._id}
								</h1>
								<p className="text-gray-600">
									Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { 
										day: 'numeric', 
										month: 'long', 
										year: 'numeric' 
									})}
								</p>
							</div>
							<div className="flex flex-col items-end gap-2">
								{getStatusBadge(order.orderStatus)}
							</div>
						</div>
					</motion.div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Left Column - Order Items */}
						<div className="lg:col-span-2">
							<motion.div 
								initial={{ opacity: 0, y: 20 }} 
								animate={{ opacity: 1, y: 0 }} 
								transition={{ delay: 0.1 }} 
								className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
							>
								<h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
								<div className="space-y-4">
									{(order.items || []).map((item, index) => {
										const productName = item.name || item.product?.name || 'Product';
										const productImage = item.image || (item.product?.images && item.product.images[0]) || '';
										const quantity = item.quantity || 1;
										const price = item.price || 0;
										
										return (
											<div 
												key={item._id || index} 
												className="flex gap-4 p-4 border border-gray-100 rounded-lg"
											>
												{productImage && (
													<img 
														src={productImage} 
														alt={productName} 
														className="w-20 h-20 object-cover rounded-lg border border-gray-200" 
													/>
												)}
												<div className="flex-1">
													<h3 className="font-semibold text-gray-900 mb-1">{productName}</h3>
													<p className="text-sm text-gray-600">Quantity: {quantity}</p>
												</div>
												<div className="text-right">
													<p className="text-lg font-bold text-gray-900">
														₹{(price || 0).toLocaleString()}
													</p>
													<p className="text-sm text-gray-500">
														Total: ₹{((price || 0) * quantity).toLocaleString()}
													</p>
												</div>
											</div>
										);
									})}
								</div>
							</motion.div>
						</div>

						{/* Right Column - Summary & Address */}
						<div className="space-y-6">
							{/* Order Summary */}
							<motion.div 
								initial={{ opacity: 0, y: 20 }} 
								animate={{ opacity: 1, y: 0 }} 
								transition={{ delay: 0.2 }} 
								className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
							>
								<h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
								<div className="space-y-3 text-sm">
									<div className="flex justify-between">
										<span className="text-gray-600">Subtotal</span>
										<span className="font-medium text-gray-900">
											₹{(order.itemsPrice || 0).toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Shipping</span>
										<span className="font-medium text-gray-900">
											₹{(order.shippingPrice || 0).toLocaleString()}
										</span>
									</div>
									{(order.taxPrice || 0) > 0 && (
										<div className="flex justify-between">
											<span className="text-gray-600">Tax</span>
											<span className="font-medium text-gray-900">
												₹{(order.taxPrice || 0).toLocaleString()}
											</span>
										</div>
									)}
									{(order.discount || 0) > 0 && (
										<div className="flex justify-between">
											<span className="text-gray-600">Discount</span>
											<span className="font-medium text-green-600">
												-₹{(order.discount || 0).toLocaleString()}
											</span>
										</div>
									)}
									<div className="pt-3 border-t border-gray-200">
										<div className="flex justify-between">
											<span className="font-semibold text-gray-900">Total</span>
											<span className="font-bold text-gray-900 text-lg">
												₹{(order.totalPrice || 0).toLocaleString()}
											</span>
										</div>
									</div>
								</div>
								<div className="mt-4 pt-4 border-t border-gray-200">
									<div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
										<CreditCard size={16} />
										<span>Payment Method</span>
									</div>
									<p className="font-medium text-gray-900">
										{order.paymentMethod || 'Not specified'}
									</p>
								</div>
							</motion.div>

							{/* Shipping Address */}
							{order.shippingAddress && (
								<motion.div 
									initial={{ opacity: 0, y: 20 }} 
									animate={{ opacity: 1, y: 0 }} 
									transition={{ delay: 0.3 }} 
									className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
								>
									<h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
									<div className="space-y-3 text-sm">
										<div className="flex items-start gap-2">
											<MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
											<div className="text-gray-600 leading-relaxed">
												{(order.shippingAddress.name || order.shippingAddress.fullName) && (
													<p className="font-medium text-gray-900 mb-1">
														{order.shippingAddress.name || order.shippingAddress.fullName}
													</p>
												)}
												{(order.shippingAddress.addressLine || order.shippingAddress.addressLine1 || order.shippingAddress.address) && (
													<p>{order.shippingAddress.addressLine || order.shippingAddress.addressLine1 || order.shippingAddress.address}</p>
												)}
												<p>
													{order.shippingAddress.city}
													{order.shippingAddress.state && `, ${order.shippingAddress.state}`}
													{order.shippingAddress.pincode && ` - ${order.shippingAddress.pincode}`}
												</p>
											</div>
										</div>
										{order.shippingAddress.phone && (
											<div className="flex items-center gap-2">
												<Phone size={16} className="text-gray-400" />
												<p className="text-gray-600">{order.shippingAddress.phone}</p>
											</div>
										)}
									</div>
								</motion.div>
							)}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default OrderDetails;

 