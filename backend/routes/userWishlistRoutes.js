import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/user/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'name price images mainImage hoverImage stock stockStatus rating numReviews slug lowStockThreshold',
    });

    // Auto-correct stock status for each item
    const wishlistItems = user.wishlist.map(item => {
      if (item && typeof item.stock !== 'undefined') {
        const correctStockStatus = 
          item.stock === 0 
            ? 'out_of_stock' 
            : item.stock <= (item.lowStockThreshold || 10)
            ? 'low_stock'
            : 'in_stock';
        
        // Update if incorrect (without saving to DB for now)
        if (item.stockStatus !== correctStockStatus) {
          console.log(`⚠️ Stock status mismatch for ${item.name}:`, {
            stock: item.stock,
            dbStatus: item.stockStatus,
            correctStatus: correctStockStatus
          });
          item.stockStatus = correctStockStatus;
        }
      }
      return item;
    });

    // Debug logging
    console.log('=== WISHLIST DEBUG ===');
    console.log('User:', req.user._id);
    console.log('Wishlist items count:', wishlistItems?.length || 0);
    if (wishlistItems && wishlistItems.length > 0) {
      wishlistItems.forEach(item => {
        console.log(`Product: ${item.name}`);
        console.log(`  - Stock: ${item.stock}`);
        console.log(`  - Stock Status: ${item.stockStatus}`);
        console.log(`  - Price:`, item.price);
      });
    }
    console.log('======================');

    res.json({
      success: true,
      data: wishlistItems || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/user/wishlist
// @desc    Add product to wishlist
// @access  Private
router.post('/wishlist', protect, async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const user = await User.findById(req.user._id);

    // Check if product already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist',
      });
    }

    user.wishlist.push(productId);
    await user.save();

    await user.populate({
      path: 'wishlist',
      select: 'name price images mainImage hoverImage stock stockStatus rating numReviews slug',
    });

    res.json({
      success: true,
      data: user.wishlist,
      message: 'Product added to wishlist',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/user/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId
    );

    await user.save();

    await user.populate({
      path: 'wishlist',
      select: 'name price images mainImage hoverImage stock stockStatus rating numReviews slug',
    });

    res.json({
      success: true,
      data: user.wishlist,
      message: 'Product removed from wishlist',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/user/wishlist
// @desc    Clear entire wishlist
// @access  Private
router.delete('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = [];
    await user.save();

    res.json({
      success: true,
      data: [],
      message: 'Wishlist cleared',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
