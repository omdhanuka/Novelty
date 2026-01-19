import express from 'express';
import { protect, authorize, auditLog } from '../middleware/auth.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import Category from '../models/Category.js';

const router = express.Router();

// All admin routes require authentication and admin/staff/support role
router.use(protect);
router.use(authorize('admin', 'staff', 'support'));

// Dashboard metrics
router.get('/dashboard/metrics', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalRevenue,
      ordersToday,
      totalOrders,
      totalCustomers,
      lowStockProducts,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.find({ stock: { $lte: 10 }, status: 'active' })
        .select('name stock sku')
        .limit(10),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
        .select('orderNumber totalPrice orderStatus createdAt'),
      Product.find({ status: 'active' })
        .sort({ sold: -1 })
        .limit(5)
        .select('name sold price mainImage'),
    ]);

    // Calculate conversion rate (orders / total customers)
    const conversionRate = totalCustomers > 0 
      ? ((totalOrders / totalCustomers) * 100).toFixed(2) 
      : 0;

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue[0]?.total || 0,
        ordersToday,
        totalOrders,
        totalCustomers,
        conversionRate: parseFloat(conversionRate),
        lowStockProducts,
        recentOrders,
        topProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Sales report
router.get('/dashboard/sales-report', async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    
    let startDate = new Date();
    if (period === '7days') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === '30days') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (period === '12months') {
      startDate.setMonth(startDate.getMonth() - 12);
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid',
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === '12months' ? '%Y-%m' : '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Payment method split
    const paymentMethodSplit = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid',
        },
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    // Category-wise sales
    const categorySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid',
        },
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $lookup: {
          from: 'categories',
          localField: 'productInfo.category',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$categoryInfo.name',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          quantity: { $sum: '$items.quantity' },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        salesData,
        paymentMethodSplit,
        categorySales,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Inventory report
router.get('/dashboard/inventory-report', async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      draftProducts,
      totalStockValue,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ stock: 0 }),
      Product.countDocuments({ $expr: { $lte: ['$stock', '$lowStockThreshold'] }, stock: { $gt: 0 } }),
      Product.countDocuments({ status: 'draft' }),
      Product.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: null,
            value: { $sum: { $multiply: ['$price', '$stock'] } },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        outOfStock,
        lowStock,
        draftProducts,
        totalStockValue: totalStockValue[0]?.value || 0,
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
