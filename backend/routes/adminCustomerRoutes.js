import express from 'express';
import { protect, authorize, auditLog } from '../middleware/auth.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'support'));

// Get all customers
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = { role: 'user' };

    // Search filter
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [customers, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    // Get order stats for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ user: customer._id });
        const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        
        return {
          ...customer.toObject(),
          orderCount: orders.length,
          totalSpent,
        };
      })
    );

    res.json({
      success: true,
      data: customersWithStats,
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

// Get single customer with details
router.get('/:id', async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    // Get customer orders
    const orders = await Order.find({ user: customer._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    res.json({
      success: true,
      data: {
        ...customer.toObject(),
        orders,
        orderCount: orders.length,
        totalSpent,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Block/Unblock customer
router.patch('/:id/block', authorize('admin'), auditLog('block_customer', 'User'), async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    customer.isActive = !customer.isActive;
    await customer.save();

    res.json({
      success: true,
      data: customer,
      message: `Customer ${customer.isActive ? 'unblocked' : 'blocked'} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Customer segmentation
router.get('/segments/stats', async (req, res) => {
  try {
    const [
      totalCustomers,
      activeCustomers,
      newThisMonth,
      highValueCustomers,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', isActive: true }),
      User.countDocuments({
        role: 'user',
        createdAt: { $gte: new Date(new Date().setDate(1)) },
      }),
      Order.aggregate([
        {
          $group: {
            _id: '$user',
            totalSpent: { $sum: '$totalPrice' },
          },
        },
        {
          $match: {
            totalSpent: { $gte: 10000 },
          },
        },
        {
          $count: 'count',
        },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        activeCustomers,
        newThisMonth,
        highValueCustomers: highValueCustomers[0]?.count || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
