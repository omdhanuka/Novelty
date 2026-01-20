import express from 'express';
import { protect, authorize, auditLog } from '../middleware/auth.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'staff'));

// Get all categories with filters and product counts
router.get('/', async (req, res) => {
  try {
    const { 
      search = '', 
      status, 
      type,
      parentOnly,
      sortBy = 'sortOrder',
      sortOrder = 'asc'
    } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Parent only filter (main categories)
    if (parentOnly === 'true') {
      query.parentCategory = null;
    }

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const categories = await Category.find(query)
      .populate('parentCategory', 'name slug')
      .populate('subcategories', 'name slug')
      .sort(sort);

    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ category: category._id });
        return {
          ...category.toObject(),
          productCount,
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCounts,
      total: categoriesWithCounts.length,
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
    const { name, slug, description, parentCategory, type, status, image, bannerImage, 
            showOnHomepage, showInNavbar, showInFooter, sortOrder, 
            seoTitle, seoDescription, seoKeywords } = req.body;

    // Auto-generate slug if not provided
    const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug: categorySlug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this slug already exists',
      });
    }

    const category = await Category.create({
      name,
      slug: categorySlug,
      description,
      parentCategory: parentCategory || null,
      type: type || 'PRODUCT',
      status: status || 'ACTIVE',
      image,
      bannerImage,
      showOnHomepage: showOnHomepage !== undefined ? showOnHomepage : true,
      showInNavbar: showInNavbar !== undefined ? showInNavbar : true,
      showInFooter: showInFooter !== undefined ? showInFooter : false,
      sortOrder: sortOrder || 0,
      seoTitle,
      seoDescription,
      seoKeywords,
      isActive: (status || 'ACTIVE') === 'ACTIVE',
    });

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
    const oldCategory = await Category.findById(req.params.id);
    
    if (!oldCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const updates = { ...req.body };
    
    // Sync isActive with status
    if (updates.status) {
      updates.isActive = updates.status === 'ACTIVE';
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id, 
      updates, 
      {
        new: true,
        runValidators: true,
      }
    );

    // Handle parent category changes
    if (req.body.parentCategory !== undefined && 
        String(oldCategory.parentCategory) !== String(req.body.parentCategory)) {
      
      // Remove from old parent
      if (oldCategory.parentCategory) {
        await Category.findByIdAndUpdate(oldCategory.parentCategory, {
          $pull: { subcategories: category._id },
        });
      }
      
      // Add to new parent
      if (req.body.parentCategory) {
        await Category.findByIdAndUpdate(req.body.parentCategory, {
          $push: { subcategories: category._id },
        });
      }
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
    const productsCount = await Product.countDocuments({ category: category._id });

    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${productsCount} products. Please reassign products first.`,
      });
    }

    // Check if category has subcategories
    if (category.subcategories && category.subcategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories. Please delete subcategories first.',
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
      categories.map(({ id, sortOrder }) =>
        Category.findByIdAndUpdate(id, { sortOrder, order: sortOrder })
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

// Toggle category status (ACTIVE/HIDDEN)
router.patch('/:id/toggle-status', auditLog('toggle-status', 'Category'), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const newStatus = category.status === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
    category.status = newStatus;
    category.isActive = newStatus === 'ACTIVE';
    await category.save();

    res.json({
      success: true,
      data: category,
      message: `Category ${newStatus === 'ACTIVE' ? 'activated' : 'hidden'} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Bulk delete categories
router.post('/bulk-delete', authorize('admin'), auditLog('bulk-delete', 'Category'), async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Category IDs array is required',
      });
    }

    const errors = [];
    const deleted = [];

    for (const id of ids) {
      const category = await Category.findById(id);
      
      if (!category) {
        errors.push({ id, error: 'Category not found' });
        continue;
      }

      const productsCount = await Product.countDocuments({ category: id });
      if (productsCount > 0) {
        errors.push({ id, error: `Has ${productsCount} products` });
        continue;
      }

      if (category.subcategories && category.subcategories.length > 0) {
        errors.push({ id, error: 'Has subcategories' });
        continue;
      }

      if (category.parentCategory) {
        await Category.findByIdAndUpdate(category.parentCategory, {
          $pull: { subcategories: category._id },
        });
      }

      await category.deleteOne();
      deleted.push(id);
    }

    res.json({
      success: true,
      data: { deleted, errors },
      message: `${deleted.length} categories deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
