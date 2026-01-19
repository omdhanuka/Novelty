import express from 'express';
import { protect, authorize, auditLog } from '../middleware/auth.js';
import Coupon from '../models/Coupon.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'staff'));

// Get all coupons
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) {
      query.isActive = status === 'active';
    }

    if (search) {
      query.code = { $regex: search, $options: 'i' };
    }

    const coupons = await Coupon.find(query)
      .populate('applicableCategories', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get single coupon
router.get('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate('applicableCategories');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    res.json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create coupon
router.post('/', authorize('admin'), auditLog('create', 'Coupon'), async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);

    res.status(201).json({
      success: true,
      data: coupon,
      message: 'Coupon created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Update coupon
router.put('/:id', authorize('admin'), auditLog('update', 'Coupon'), async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    res.json({
      success: true,
      data: coupon,
      message: 'Coupon updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete coupon
router.delete('/:id', authorize('admin'), auditLog('delete', 'Coupon'), async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    res.json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Toggle coupon status
router.patch('/:id/toggle', auditLog('toggle_status', 'Coupon'), async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.json({
      success: true,
      data: coupon,
      message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
