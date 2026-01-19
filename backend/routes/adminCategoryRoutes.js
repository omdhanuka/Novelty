import express from 'express';
import { protect, authorize, auditLog } from '../middleware/auth.js';
import Category from '../models/Category.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'staff'));

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parentCategory', 'name')
      .sort({ order: 1, name: 1 });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory')
      .populate('subcategories');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create category
router.post('/', auditLog('create', 'Category'), async (req, res) => {
  try {
    const category = await Category.create(req.body);

    // If has parent, add to parent's subcategories
    if (category.parentCategory) {
      await Category.findByIdAndUpdate(category.parentCategory, {
        $push: { subcategories: category._id },
      });
    }

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Update category
router.put('/:id', auditLog('update', 'Category'), async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete category
router.delete('/:id', authorize('admin'), auditLog('delete', 'Category'), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if category has products
    const Product = (await import('../models/Product.js')).default;
    const productsCount = await Product.countDocuments({ category: category._id });

    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with products. Please reassign products first.',
      });
    }

    // Remove from parent's subcategories if applicable
    if (category.parentCategory) {
      await Category.findByIdAndUpdate(category.parentCategory, {
        $pull: { subcategories: category._id },
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Reorder categories
router.patch('/reorder', auditLog('reorder', 'Category'), async (req, res) => {
  try {
    const { categories } = req.body; // Array of { id, order }

    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: 'Categories array is required',
      });
    }

    await Promise.all(
      categories.map(({ id, order }) =>
        Category.findByIdAndUpdate(id, { order })
      )
    );

    res.json({
      success: true,
      message: 'Categories reordered successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
