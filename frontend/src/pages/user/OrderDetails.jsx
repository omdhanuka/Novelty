import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
	ArrowLeft, Package, CheckCircle, XCircle, Truck, Clock, MapPin, Phone, 
	CreditCard, Download, RotateCcw, MessageCircle, Mail, ShoppingBag,
	CheckCircle2, PackageCheck, TruckIcon, Home, Ban, RefreshCw, HelpCircle
} from 'lucide-react';
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
	const [cancelLoading, setCancelLoading] = useState(false);

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
			placed: { icon: ShoppingBag, color: 'text-blue-700', bg: 'bg-blue-100', label: 'Order Placed' },
			confirmed: { icon: CheckCircle2, color: 'text-indigo-700', bg: 'bg-indigo-100', label: 'Confirmed' },
			packed: { icon: PackageCheck, color: 'text-purple-700', bg: 'bg-purple-100', label: 'Packed' },
			shipped: { icon: Truck, color: 'text-orange-700', bg: 'bg-orange-100', label: 'Shipped' },
			delivered: { icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-100', label: 'Delivered' },
			cancelled: { icon: XCircle, color: 'text-red-700', bg: 'bg-red-100', label: 'Cancelled' },
			refunded: { icon: RefreshCw, color: 'text-gray-700', bg: 'bg-gray-100', label: 'Refunded' },
		};
		
		const statusKey = (status || 'placed').toString().toLowerCase();
		const config = statusMap[statusKey] || statusMap.placed;
		const Icon = config.icon;
		
		return (
			<span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${config.bg} ${config.color}`}>
				<Icon size={18} />
				{config.label}
			</span>
		);
	};

	const getPaymentStatusBadge = (status, paymentMethod) => {
		if (paymentMethod === 'COD') {
			return (
				<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
					Cash on Delivery
				</span>
			);
		}

		const statusMap = {
			pending: { color: 'text-yellow-700', bg: 'bg-yellow-100', label: 'Payment Pending' },
			paid: { color: 'text-green-700', bg: 'bg-green-100', label: 'Paid' },
			failed: { color: 'text-red-700', bg: 'bg-red-100', label: 'Payment Failed' },
			refunded: { color: 'text-gray-700', bg: 'bg-gray-100', label: 'Refunded' },
		};
		
		const statusKey = (status || 'pending').toString().toLowerCase();
		const config = statusMap[statusKey] || statusMap.pending;
		
		return (
			<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
				{config.label}
			</span>
		);
	};

	const handleCancelOrder = async () => {
		if (!window.confirm('Are you sure you want to cancel this order?')) {
			return;
		}

		setCancelLoading(true);
		try {
			const response = await api.put(`/user/orders/${orderId}/cancel`);
			if (response.data.success) {
				await fetchOrder();
				alert('Order cancelled successfully');
			}
		} catch (error) {
			console.error('Error canceling order:', error);
			alert(error.response?.data?.message || 'Failed to cancel order');
		} finally {
			setCancelLoading(false);
		}
	};

	const handleReorder = () => {
		if (order?.items && order.items.length > 0) {
			const firstProduct = order.items[0];
			if (firstProduct?.product?._id) {
				navigate(`/products/${firstProduct.product._id}`);
			}
		}
	};

	const handleDownloadInvoice = () => {
		alert('Invoice download feature will be implemented soon');
	};

	const canCancelOrder = () => {
		const status = (order?.orderStatus || '').toLowerCase();
		return ['placed', 'confirmed'].includes(status);
	};

	const getOrderTimeline = () => {
		const status = (order?.orderStatus || '').toLowerCase();
		const timeline = [
			{ 
				key: 'placed', 
				label: 'Order Placed', 
				icon: ShoppingBag,
				active: true,
				completed: true,
				date: order?.createdAt
			},
			{ 
				key: 'confirmed', 
				label: 'Order Confirmed', 
				icon: CheckCircle2,
				active: ['confirmed', 'packed', 'shipped', 'delivered'].includes(status),
				completed: ['confirmed', 'packed', 'shipped', 'delivered'].includes(status),
				date: order?.statusHistory?.find(h => h.status === 'confirmed')?.updatedAt
			},
			{ 
				key: 'packed', 
				label: 'Packed', 
				icon: PackageCheck,
				active: ['packed', 'shipped', 'delivered'].includes(status),
				completed: ['packed', 'shipped', 'delivered'].includes(status),
				date: order?.statusHistory?.find(h => h.status === 'packed')?.updatedAt
			},
			{ 
				key: 'shipped', 
				label: 'Shipped', 
				icon: TruckIcon,
				active: ['shipped', 'delivered'].includes(status),
				completed: ['shipped', 'delivered'].includes(status),
				date: order?.statusHistory?.find(h => h.status === 'shipped')?.updatedAt
			},
			{ 
				key: 'delivered', 
				label: 'Delivered', 
				icon: Home,
				active: status === 'delivered',
				completed: status === 'delivered',
				date: order?.deliveredAt || order?.statusHistory?.find(h => h.status === 'delivered')?.updatedAt
			},
		];

		if (status === 'cancelled' || status === 'refunded') {
			return [
				{ 
					key: 'placed', 
					label: 'Order Placed', 
					icon: ShoppingBag,
					active: true,
					completed: true,
					date: order?.createdAt
				},
				{ 
					key: status, 
					label: status === 'cancelled' ? 'Order Cancelled' : 'Order Refunded', 
					icon: status === 'cancelled' ? Ban : RefreshCw,
					active: true,
					completed: true,
					date: order?.statusHistory?.find(h => h.status === status)?.updatedAt || order?.updatedAt
				},
			];
		}

		return timeline;
	};

	if (loading) {
		return (
			<>
				<Header />
				<div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Loading order details...</p>
					</div>
				</div>
				<Footer />
			</>
		);
	}

	if (error || !order) {
		return (
			<>
				<Header />
				<div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
					<div className="text-center">
						<Package size={64} className="mx-auto text-gray-300 mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 mb-2">
							{error || 'Order Not Found'}
						</h2>
						<Link to="/orders" className="text-indigo-600 hover:text-indigo-700 font-medium">
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
			<div className="min-h-screen bg-[#F8F9FB] py-8 md:py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Back Button */}
					<motion.div 
						initial={{ opacity: 0, x: -20 }} 
						animate={{ opacity: 1, x: 0 }} 
						className="mb-6"
					>
						<Link 
							to="/orders" 
							className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
						>
							<ArrowLeft size={20} />
							<span>Back to Orders</span>
						</Link>
					</motion.div>

					{/* Page Title */}
					<motion.div 
						initial={{ opacity: 0, y: -10 }} 
						animate={{ opacity: 1, y: 0 }} 
						className="mb-6"
					>
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900">Order Details</h1>
					</motion.div>

					{/* Order Summary Header Card */}
					<motion.div 
						initial={{ opacity: 0, y: 20 }} 
						animate={{ opacity: 1, y: 0 }} 
						className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6"
					>
						<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
							<div className="flex-1">
								<div className="flex items-start gap-4 mb-4">
									<div className="bg-indigo-50 p-3 rounded-xl">
										<Package className="text-indigo-600" size={28} />
									</div>
									<div>
										<h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
											Order #{order.orderNumber || order._id?.slice(-8)}
										</h2>
										<p className="text-gray-600 text-sm md:text-base">
											Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { 
												day: 'numeric', 
												month: 'long', 
												year: 'numeric',
												hour: '2-digit',
												minute: '2-digit'
											})}
										</p>
									</div>
								</div>
								
								<div className="flex flex-wrap items-center gap-3">
									<div>
										<p className="text-xs text-gray-500 mb-1">Order Status</p>
										{getStatusBadge(order.orderStatus)}
									</div>
									<div>
										<p className="text-xs text-gray-500 mb-1">Payment Status</p>
										{getPaymentStatusBadge(order.paymentStatus, order.paymentMethod)}
									</div>
								</div>
							</div>

							<div className="bg-indigo-50 rounded-xl p-4 md:p-6 text-center md:text-right">
								<p className="text-sm text-indigo-700 font-medium mb-1">Total Amount</p>
								<p className="text-3xl md:text-4xl font-bold text-indigo-900">
									₹{(order.totalPrice || 0).toLocaleString('en-IN')}
								</p>
							</div>
						</div>
					</motion.div>

					{/* Two Column Layout */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Left Column - Order Items & Timeline */}
						<div className="lg:col-span-2 space-y-6">
							{/* Order Items Card */}
							<motion.div 
								initial={{ opacity: 0, y: 20 }} 
								animate={{ opacity: 1, y: 0 }} 
								transition={{ delay: 0.1 }} 
								className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
							>
								<h2 className="text-xl font-bold text-gray-900 mb-6">Ordered Items</h2>
								<div className="space-y-4">
									{(order.items || []).map((item, index) => {
										const productName = item.name || item.product?.name || 'Product';
										const category = item.product?.category?.name || 'Uncategorized';
										
										const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Cg transform='translate(100 100)'%3E%3Crect x='-30' y='-45' width='60' height='60' fill='%23d1d5db' rx='3'/%3E%3Ccircle cx='0' cy='-25' r='8' fill='%239ca3af'/%3E%3Cpath d='M -18 -12 L -8 -22 L 3 -12 L 18 -25 L 18 0 L -18 0 Z' fill='%239ca3af'/%3E%3C/g%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='12' x='100' y='140' text-anchor='middle'%3ENo Image%3C/svg%3E";
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
										
										const quantity = item.quantity || 1;
										const price = item.price || 0;
										const subtotal = price * quantity;
										
										return (
											<div 
												key={item._id || index} 
												className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
											>
												<div className="w-24 h-24 md:w-28 md:h-28 shrink-0">
													<img 
														src={imageUrl} 
														alt={productName} 
														className="w-full h-full object-cover rounded-lg border border-gray-200" 
														onError={(e) => {
															if (!e.target.src.startsWith('data:image')) {
																e.target.src = placeholderSvg;
															}
														}}
													/>
												</div>
												<div className="flex-1 min-w-0">
													<h3 className="font-semibold text-gray-900 mb-1 text-base md:text-lg">{productName}</h3>
													<p className="text-sm text-gray-500 mb-2">{category}</p>
													
													{(item.selectedColor || item.selectedSize) && (
														<div className="flex flex-wrap gap-2 mb-2">
															{item.selectedColor && (
																<span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full text-xs">
																	<div 
																		className="w-3 h-3 rounded-full border border-gray-300" 
																		style={{ backgroundColor: item.selectedColor.toLowerCase() }}
																	/>
																	<span className="font-medium">{item.selectedColor}</span>
																</span>
															)}
															{item.selectedSize && (
																<span className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium">
																	Size: {item.selectedSize}
																</span>
															)}
														</div>
													)}
													
													<div className="flex items-center gap-4 text-sm">
														<p className="text-gray-600">
															Qty: <span className="font-medium text-gray-900">{quantity}</span>
														</p>
														<p className="text-gray-600">
															Price: <span className="font-medium text-gray-900">₹{price.toLocaleString('en-IN')}</span>
														</p>
													</div>
												</div>
												<div className="text-right shrink-0">
													<p className="text-lg md:text-xl font-bold text-gray-900">
														₹{subtotal.toLocaleString('en-IN')}
													</p>
													<p className="text-xs text-gray-500 mt-1">Subtotal</p>
												</div>
											</div>
										);
									})}
								</div>
							</motion.div>

							{/* Order Timeline Card */}
							<motion.div 
								initial={{ opacity: 0, y: 20 }} 
								animate={{ opacity: 1, y: 0 }} 
								transition={{ delay: 0.2 }} 
								className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
							>
								<h2 className="text-xl font-bold text-gray-900 mb-6">Order Tracking</h2>
								<div className="relative">
									{getOrderTimeline().map((step, index) => {
										const Icon = step.icon;
										const isLast = index === getOrderTimeline().length - 1;
										
										return (
											<div key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
												{!isLast && (
													<div 
														className={`absolute left-5 top-12 w-0.5 h-full -ml-px ${
															step.completed ? 'bg-indigo-500' : 'bg-gray-200'
														}`}
													/>
												)}
												
												<div 
													className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 ${
														step.active 
															? step.completed 
																? 'bg-indigo-500 border-indigo-500' 
																: 'bg-white border-indigo-500'
															: 'bg-gray-100 border-gray-300'
													}`}
												>
													<Icon 
														size={20} 
														className={step.active ? (step.completed ? 'text-white' : 'text-indigo-600') : 'text-gray-400'} 
													/>
												</div>
												
												<div className="flex-1 pt-1">
													<p 
														className={`font-semibold mb-1 ${
															step.active ? 'text-gray-900' : 'text-gray-500'
														}`}
													>
														{step.label}
													</p>
													{step.date && (
														<p className="text-sm text-gray-500">
															{new Date(step.date).toLocaleDateString('en-IN', { 
																day: 'numeric', 
																month: 'short', 
																year: 'numeric',
																hour: '2-digit',
																minute: '2-digit'
															})}
														</p>
													)}
												</div>
											</div>
										);
									})}
								</div>

								{order.trackingNumber && (
									<div className="mt-6 pt-6 border-t border-gray-200">
										<div className="bg-indigo-50 rounded-xl p-4">
											<div className="flex items-start gap-3">
												<TruckIcon className="text-indigo-600 shrink-0 mt-0.5" size={20} />
												<div>
													<p className="text-sm font-medium text-indigo-900 mb-1">Tracking Information</p>
													<p className="text-sm text-indigo-700">
														{order.courierName && <span className="font-medium">{order.courierName}: </span>}
														{order.trackingNumber}
													</p>
												</div>
											</div>
										</div>
									</div>
								)}
							</motion.div>
						</div>

						{/* Right Column */}
						<div className="space-y-6">
							{/* Price Breakdown Card */}
							<motion.div 
								initial={{ opacity: 0, y: 20 }} 
								animate={{ opacity: 1, y: 0 }} 
								transition={{ delay: 0.25 }} 
								className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
							>
								<h2 className="text-lg font-bold text-gray-900 mb-4">Price Breakdown</h2>
								<div className="space-y-3">
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Cart Total</span>
										<span className="font-medium text-gray-900">
											₹{(order.itemsPrice || 0).toLocaleString('en-IN')}
										</span>
									</div>
									
									{(order.discount || 0) > 0 && (
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">
												Discount
												{order.couponApplied?.code && (
													<span className="ml-1 text-xs text-green-600">({order.couponApplied.code})</span>
												)}
											</span>
											<span className="font-medium text-green-600">
												-₹{(order.discount || 0).toLocaleString('en-IN')}
											</span>
										</div>
									)}
									
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Delivery Charges</span>
										<span className="font-medium text-gray-900">
											{(order.shippingPrice || 0) === 0 ? (
												<span className="text-green-600">FREE</span>
											) : (
												`₹${(order.shippingPrice || 0).toLocaleString('en-IN')}`
											)}
										</span>
									</div>
									
									{(order.taxPrice || 0) > 0 && (
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">Tax (GST)</span>
											<span className="font-medium text-gray-900">
												₹{(order.taxPrice || 0).toLocaleString('en-IN')}
											</span>
										</div>
									)}
									
									<div className="pt-3 border-t border-gray-200">
										<div className="flex justify-between items-center">
											<span className="font-bold text-gray-900">Final Amount</span>
											<span className="text-2xl font-bold text-indigo-600">
												₹{(order.totalPrice || 0).toLocaleString('en-IN')}
											</span>
										</div>
									</div>
								</div>
							</motion.div>

							{/* Delivery Address Card */}
							{order.shippingAddress && (
								<motion.div 
									initial={{ opacity: 0, y: 20 }} 
									animate={{ opacity: 1, y: 0 }} 
									transition={{ delay: 0.3 }} 
									className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
								>
									<h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Address</h2>
									<div className="space-y-3">
										<div className="flex items-start gap-3">
											<MapPin size={18} className="text-indigo-600 mt-1 shrink-0" />
											<div className="text-sm leading-relaxed">
												<p className="font-semibold text-gray-900 mb-2">
													{order.shippingAddress.fullName || order.shippingAddress.name}
												</p>
												<p className="text-gray-600 mb-1">
													{order.shippingAddress.addressLine1 || order.shippingAddress.addressLine || order.shippingAddress.address}
												</p>
												{order.shippingAddress.addressLine2 && (
													<p className="text-gray-600 mb-1">{order.shippingAddress.addressLine2}</p>
												)}
												{order.shippingAddress.landmark && (
													<p className="text-gray-600 mb-1">Landmark: {order.shippingAddress.landmark}</p>
												)}
												<p className="text-gray-600">
													{order.shippingAddress.city}, {order.shippingAddress.state}
												</p>
												<p className="text-gray-600 font-medium">
													{order.shippingAddress.pincode}
												</p>
											</div>
										</div>
										
										{order.shippingAddress.phone && (
											<div className="flex items-center gap-3 pt-3 border-t border-gray-100">
												<Phone size={18} className="text-indigo-600 shrink-0" />
												<p className="text-sm font-medium text-gray-900">{order.shippingAddress.phone}</p>
											</div>
										)}
									</div>
								</motion.div>
							)}

							{/* Payment Information Card */}
							<motion.div 
								initial={{ opacity: 0, y: 20 }} 
								animate={{ opacity: 1, y: 0 }} 
								transition={{ delay: 0.35 }} 
								className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
							>
								<h2 className="text-lg font-bold text-gray-900 mb-4">Payment Information</h2>
								<div className="space-y-3">
									<div className="flex items-center gap-3">
										<CreditCard size={18} className="text-indigo-600 shrink-0" />
										<div className="text-sm flex-1">
											<p className="text-gray-600 mb-1">Payment Method</p>
											<p className="font-semibold text-gray-900">{order.paymentMethod || 'Not specified'}</p>
										</div>
									</div>
									
									{order.paymentInfo?.razorpayPaymentId && (
										<div className="pt-3 border-t border-gray-100">
											<p className="text-xs text-gray-500 mb-1">Transaction ID</p>
											<p className="text-sm font-mono text-gray-900 break-all">
												{order.paymentInfo.razorpayPaymentId}
											</p>
										</div>
									)}
									
									{order.paidAt && (
										<div className="pt-3 border-t border-gray-100">
											<p className="text-xs text-gray-500 mb-1">Payment Date</p>
											<p className="text-sm text-gray-900">
												{new Date(order.paidAt).toLocaleDateString('en-IN', { 
													day: 'numeric', 
													month: 'long', 
													year: 'numeric',
													hour: '2-digit',
													minute: '2-digit'
												})}
											</p>
										</div>
									)}
									
									<button
										onClick={handleDownloadInvoice}
										className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-colors"
									>
										<Download size={18} />
										<span>Download Invoice</span>
									</button>
								</div>
							</motion.div>

							{/* Action Buttons Card */}
							<motion.div 
								initial={{ opacity: 0, y: 20 }} 
								animate={{ opacity: 1, y: 0 }} 
								transition={{ delay: 0.4 }} 
								className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
							>
								<div className="space-y-3">
									{canCancelOrder() && (
										<button
											onClick={handleCancelOrder}
											disabled={cancelLoading}
											className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<XCircle size={20} />
											<span>{cancelLoading ? 'Cancelling...' : 'Cancel Order'}</span>
										</button>
									)}
									
									<button
										onClick={() => navigate(`/track-order/${order._id}`)}
										className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
									>
										<Truck size={20} />
										<span>Track Order</span>
									</button>
									
									<button
										onClick={handleReorder}
										className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-colors"
									>
										<RotateCcw size={20} />
										<span>Reorder</span>
									</button>
								</div>
							</motion.div>

							{/* Support Card */}
							<motion.div 
								initial={{ opacity: 0, y: 20 }} 
								animate={{ opacity: 1, y: 0 }} 
								transition={{ delay: 0.45 }} 
								className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6"
							>
								<div className="flex items-start gap-3 mb-4">
									<div className="bg-white p-2 rounded-lg">
										<HelpCircle className="text-indigo-600" size={24} />
									</div>
									<div>
										<h3 className="font-bold text-gray-900 mb-1">Need Help?</h3>
										<p className="text-sm text-gray-600">We're here to assist you</p>
									</div>
								</div>
								
								<div className="space-y-2">
									<a 
										href="mailto:support@novelty.com" 
										className="flex items-center gap-2 text-sm text-indigo-700 hover:text-indigo-800 font-medium"
									>
										<Mail size={16} />
										<span>support@novelty.com</span>
									</a>
									<a 
										href="tel:+919876543210" 
										className="flex items-center gap-2 text-sm text-indigo-700 hover:text-indigo-800 font-medium"
									>
										<Phone size={16} />
										<span>+91 98765 43210</span>
									</a>
									<button 
										className="flex items-center gap-2 text-sm text-indigo-700 hover:text-indigo-800 font-medium"
									>
										<MessageCircle size={16} />
										<span>Chat with us</span>
									</button>
								</div>
							</motion.div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default OrderDetails;

