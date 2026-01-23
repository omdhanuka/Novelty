import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    console.log('Fetching categories...');
    
    // Try multiple conditions to find categories
    let categories = await Category.find({ isActive: true })
      .populate('subcategories')
      .sort('order');
    
    console.log('Found categories with isActive=true:', categories.length);
    
    // If no categories found with isActive, try status field
    if (categories.length === 0) {
      categories = await Category.find({ status: 'ACTIVE' })
        .populate('subcategories')
        .sort('sortOrder');
      console.log('Found categories with status=ACTIVE:', categories.length);
    }
    
    // If still no categories, get all
    if (categories.length === 0) {
      categories = await Category.find()
        .populate('subcategories')
        .sort('sortOrder');
      console.log('Found all categories (no filter):', categories.length);
    }
    
    console.log('Returning categories:', categories.map(c => ({ id: c._id, name: c.name })));
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Category fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('subcategories');
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
