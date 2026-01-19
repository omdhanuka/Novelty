import express from 'express';
import { protect, authorize, auditLog } from '../middleware/auth.js';
import Product from '../models/Product.js';
import InventoryLog from '../models/InventoryLog.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// All routes require admin or staff access
router.use(protect);
router.use(authorize('admin', 'staff'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  },
});

// Get all products with filters and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      category,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      stockFilter, // 'low', 'out', 'all'
    } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Stock filter
    if (stockFilter === 'low') {
      query.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
      query.stock = { $gt: 0 };
    } else if (stockFilter === 'out') {
      query.stock = 0;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
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

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create product
router.post('/', auditLog('create', 'Product'), async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Update product
router.put('/:id', auditLog('update', 'Product'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete product
router.delete('/:id', auditLog('delete', 'Product'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update stock
router.patch('/:id/stock', auditLog('update_stock', 'Product'), async (req, res) => {
  try {
    const { action, quantity, reason, notes } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const previousStock = product.stock;
    let newStock = previousStock;

    if (action === 'add') {
      newStock = previousStock + quantity;
    } else if (action === 'reduce') {
      newStock = Math.max(0, previousStock - quantity);
    } else if (action === 'set') {
      newStock = quantity;
    }

    product.stock = newStock;
    
    // Update status based on stock
    if (newStock === 0) {
      product.status = 'out_of_stock';
    } else if (product.status === 'out_of_stock') {
      product.status = 'active';
    }

    await product.save();

    // Log inventory change
    await InventoryLog.create({
      product: product._id,
      action,
      quantity,
      previousStock,
      newStock,
      reason,
      notes,
      performedBy: req.user._id,
    });

    res.json({
      success: true,
      data: product,
      message: 'Stock updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Bulk upload products (CSV)
router.post('/bulk-upload', authorize('admin'), async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required',
      });
    }

    const results = {
      success: [],
      failed: [],
    };

    for (const productData of products) {
      try {
        const product = await Product.create(productData);
        results.success.push(product);
      } catch (error) {
        results.failed.push({
          data: productData,
          error: error.message,
        });
      }
    }

    res.json({
      success: true,
      data: results,
      message: `${results.success.length} products uploaded successfully, ${results.failed.length} failed`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Bulk price update
router.patch('/bulk-price-update', authorize('admin'), async (req, res) => {
  try {
    const { productIds, priceChange } = req.body;
    const { type, value } = priceChange; // type: 'percentage' or 'fixed', value: number

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required',
      });
    }

    const products = await Product.find({ _id: { $in: productIds } });

    for (const product of products) {
      if (type === 'percentage') {
        product.price = product.price * (1 + value / 100);
      } else if (type === 'fixed') {
        product.price = product.price + value;
      }
      await product.save();
    }

    res.json({
      success: true,
      message: `${products.length} products updated successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
