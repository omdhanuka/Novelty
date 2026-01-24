import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create new order
router.post('/', protect, async (req, res) => {
  try {
    const {
      address,
      paymentMethod,
      items,
      coupon,
    } = req.body;

    if (!address || !paymentMethod || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Get the full address details
    const User = mongoose.model('User');
    const user = await User.findById(req.user._id);
    const shippingAddress = user.addresses?.id(address);

    if (!shippingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // Map user address shape to order shippingAddress shape
    // Support different address schemas (legacy vs new)
    const mappedAddress = {
      fullName: shippingAddress.fullName || shippingAddress.name || shippingAddress.fullname || '',
      phone: shippingAddress.phone || shippingAddress.mobile || shippingAddress.contact || '',
      addressLine1: shippingAddress.addressLine1 || shippingAddress.addressLine || shippingAddress.street || '',
      addressLine2: shippingAddress.addressLine2 || shippingAddress.addressLine2 || '',
      city: shippingAddress.city || '',
      state: shippingAddress.state || '',
      pincode: shippingAddress.pincode || shippingAddress.zip || shippingAddress.postalCode || '',
      landmark: shippingAddress.landmark || '',
    };

    // Validate required mapped fields
    if (!mappedAddress.fullName || !mappedAddress.phone || !mappedAddress.addressLine1 || !mappedAddress.city || !mappedAddress.state || !mappedAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Incomplete address information',
        details: mappedAddress,
      });
    }

    // Normalize payment method to match Order schema enum
    const normalizePaymentMethod = (pm) => {
      if (!pm) return pm;
      const key = pm.toString().toLowerCase();
      if (key === 'cod' || key === 'cashondelivery' || key === 'cash_on_delivery') return 'COD';
      if (key === 'card' || key === 'credit' || key === 'debit' || key === 'creditcard' || key === 'debitcard') return 'Card';
      if (key === 'upi') return 'UPI';
      if (key === 'netbanking' || key === 'net_banking' || key === 'net') return 'NetBanking';
      if (key === 'wallet' || key === 'wallets') return 'Wallet';
      return pm;
    };

    const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);

    // Calculate order totals
    let itemsPrice = 0;
    const orderItems = items.map(item => {
      const price = item.productSnapshot?.price || 0;
      const quantity = item.quantity || 1;
      itemsPrice += price * quantity;

      return {
        product: item.product?._id || item.product,
        name: item.productSnapshot?.name || item.product?.name,
        image: item.productSnapshot?.image || item.product?.mainImage,
        price: price,
        quantity: quantity,
        selectedColor: item.selectedColor || '',
        selectedSize: item.selectedSize || '',
      };
    });

    // Validate stock availability and update quantities
    const Product = mongoose.model('Product');
    for (const item of items) {
      const productId = item.product?._id || item.product;
      const quantity = item.quantity || 1;

      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productSnapshot?.name || productId}`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${quantity}`,
        });
      }
    }

    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = Math.round(itemsPrice * 0.18);
    const discount = 0; // Will be calculated with coupon logic
    const totalPrice = itemsPrice + shippingPrice + taxPrice - discount;

    // Generate order number
    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const order = await Order.create({
      user: req.user._id,
      orderNumber,
      items: orderItems,
      shippingAddress: mappedAddress,
      paymentMethod: normalizedPaymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      discount,
      totalPrice,
      paymentStatus: normalizedPaymentMethod === 'COD' ? 'pending' : 'paid',
    });

    // Deduct stock quantities after successful order creation
    for (const item of items) {
      const productId = item.product?._id || item.product;
      const quantity = item.quantity || 1;

      const product = await Product.findById(productId);
      product.stock -= quantity;

      // Update stock status based on new quantity
      if (product.stock === 0) {
        product.stockStatus = 'out_of_stock';
      } else if (product.stock <= product.lowStockThreshold) {
        product.stockStatus = 'low_stock';
      } else {
        product.stockStatus = 'in_stock';
      }

      await product.save();
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all orders for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name mainImage')
      .sort('-createdAt');

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name mainImage')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update order status (admin only)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
