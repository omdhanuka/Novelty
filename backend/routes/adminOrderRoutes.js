import express from 'express';
import { protect, authorize, auditLog } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const router = express.Router();

// All routes require authentication
router.use(protect);
router.use(authorize('admin', 'staff', 'support'));

// Get all orders with filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      paymentMethod,
      search,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    // Status filters
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Enhanced search by order number, customer name, email, phone
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const users = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
        ],
      }).select('_id');
      
      query.$or = [
        { orderNumber: searchRegex },
        { user: { $in: users.map(u => u._id) } },
        { 'shippingAddress.phone': searchRegex },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product')
      .populate('notes.createdBy', 'name')
      .populate('statusHistory.updatedBy', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Get payment details
    const payment = await Payment.findOne({ order: order._id });

    res.json({
      success: true,
      data: {
        ...order.toObject(),
        payment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update order status
router.patch('/:id/status', auditLog('update_status', 'Order'), async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = status;

    // Add to status history
    order.statusHistory.push({
      status,
      updatedBy: req.user._id,
      updatedAt: new Date(),
    });

    // Add note if provided
    if (note) {
      order.notes.push({
        message: `Status changed from ${previousStatus} to ${status}. ${note}`,
        createdBy: req.user._id,
      });
    }

    // Update delivery status
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Add tracking ID
router.patch('/:id/tracking', auditLog('add_tracking', 'Order'), async (req, res) => {
  try {
    const { trackingId, courierName } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.trackingId = trackingId;
    order.trackingNumber = trackingId;
    order.courierName = courierName;

    // Update status to shipped if not already
    if (order.orderStatus !== 'shipped' && order.orderStatus !== 'delivered') {
      order.orderStatus = 'shipped';
      order.statusHistory.push({
        status: 'shipped',
        updatedBy: req.user._id,
      });
    }

    order.notes.push({
      message: `Tracking ID ${trackingId} added. Courier: ${courierName}`,
      createdBy: req.user._id,
    });

    await order.save();

    res.json({
      success: true,
      data: order,
      message: 'Tracking information added successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Add internal note
router.post('/:id/notes', auditLog('add_note', 'Order'), async (req, res) => {
  try {
    const { message } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.notes.push({
      message,
      createdBy: req.user._id,
    });

    await order.save();

    res.json({
      success: true,
      data: order,
      message: 'Note added successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Refund order
router.post('/:id/refund', authorize('admin'), auditLog('refund', 'Order'), async (req, res) => {
  try {
    const { amount, reason, refundType } = req.body; // refundType: 'full' or 'partial'
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const payment = await Payment.findOne({ order: order._id });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Validate refund amount
    const maxRefundAmount = payment.amount - payment.refundedAmount;
    if (amount > maxRefundAmount) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount exceeds available balance',
      });
    }

    // Update payment
    payment.refundedAmount += amount;
    payment.status = refundType === 'full' ? 'refunded' : 'partially_refunded';
    payment.refunds.push({
      amount,
      reason,
      status: 'processed',
      refundedAt: new Date(),
    });

    // Update order
    order.orderStatus = 'refunded';
    order.paymentStatus = 'refunded';
    order.notes.push({
      message: `Refund of ₹${amount} processed. Reason: ${reason}`,
      createdBy: req.user._id,
    });

    await Promise.all([payment.save(), order.save()]);

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    res.json({
      success: true,
      data: { order, payment },
      message: 'Refund processed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Cancel order
router.patch('/:id/cancel', auditLog('cancel', 'Order'), async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel shipped or delivered orders',
      });
    }

    order.orderStatus = 'cancelled';
    order.notes.push({
      message: `Order cancelled. Reason: ${reason}`,
      createdBy: req.user._id,
    });

    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    res.json({
      success: true,
      data: order,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Bulk update order status
router.patch('/bulk/status', auditLog('bulk_update_status', 'Order'), async (req, res) => {
  try {
    const { orderIds, status, note } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order IDs array is required',
      });
    }

    const updateResult = await Order.updateMany(
      { _id: { $in: orderIds } },
      { 
        $set: { orderStatus: status },
        $push: {
          statusHistory: {
            status,
            updatedBy: req.user._id,
            updatedAt: new Date(),
          },
          ...(note && {
            notes: {
              message: `Bulk status update: ${note}`,
              createdBy: req.user._id,
            },
          }),
        },
      }
    );

    res.json({
      success: true,
      data: updateResult,
      message: `${updateResult.modifiedCount} orders updated successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get order statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $facet: {
          byStatus: [
            {
              $group: {
                _id: '$orderStatus',
                count: { $sum: 1 },
                totalAmount: { $sum: '$totalPrice' },
              },
            },
          ],
          byPaymentStatus: [
            {
              $group: {
                _id: '$paymentStatus',
                count: { $sum: 1 },
                totalAmount: { $sum: '$totalPrice' },
              },
            },
          ],
          byPaymentMethod: [
            {
              $group: {
                _id: '$paymentMethod',
                count: { $sum: 1 },
                totalAmount: { $sum: '$totalPrice' },
              },
            },
          ],
          total: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                totalRevenue: { $sum: '$totalPrice' },
              },
            },
          ],
        },
      },
    ]);

    res.json({
      success: true,
      data: stats[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Export orders
router.get('/export', async (req, res) => {
  try {
    const { format = 'csv', status, paymentStatus, search } = req.query;

    // Build query
    const query = {};
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const users = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
        ],
      }).select('_id');
      
      query.$or = [
        { user: { $in: users.map(u => u._id) } },
        { orderNumber: searchRegex },
        { 'shippingAddress.phone': searchRegex },
      ];
    }

    // Fetch orders
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    if (format === 'csv') {
      // Generate CSV
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
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
      return res.send(csv);
    } else {
      // For Excel format, send JSON (frontend can convert)
      res.json({
        success: true,
        data: orders,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
