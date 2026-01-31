import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/user/orders
// @desc    Get all orders for logged-in user
// @access  Private
router.get('/orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images mainImage')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/user/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/orders/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('items.product', 'name images mainImage');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/user/orders/:id/cancel
// @desc    Cancel an order
// @access  Private
router.post('/orders/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.orderStatus !== 'pending' && order.orderStatus !== 'processing') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage',
      });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    // Restore product stock and adjust sold count
    const Product = mongoose.model('Product');
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        // Add quantity back to stock
        product.stock += item.quantity;
        // Subtract from sold count
        product.sold = Math.max(0, (product.sold || 0) - item.quantity);
        // Stock status will be auto-updated by the pre-save hook
        await product.save();
        console.log(`✅ User cancelled - Restored ${item.quantity} units of ${product.name} to stock`);
      }
    }

    res.json({
      success: true,
      data: order,
      message: 'Order cancelled successfully and stock restored',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
