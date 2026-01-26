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
    // Only validate if it's actually a file upload field
    const imageFields = ['mainImage', 'images', 'hoverImage'];
    
    // Skip validation for non-image fields or if no file provided
    if (!imageFields.includes(file.fieldname) || !file.originalname || file.size === 0) {
      return cb(null, false); // Skip this file
    }
    
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const mimetype = file.mimetype && filetypes.test(file.mimetype);
    const extname = file.originalname && filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    // Log the issue for debugging
    console.log('❌ Invalid file:', {
      fieldname: file.fieldname,
      mimetype: file.mimetype,
      originalname: file.originalname
    });
    
    cb(null, false); // Skip invalid files instead of throwing error
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
router.post('/', upload.any(), auditLog('create', 'Product'), async (req, res) => {
  try {
    console.log('📦 Product creation request received');
    console.log('Body keys:', Object.keys(req.body));
    console.log('Name:', req.body.name);
    console.log('Category:', req.body.category);
    console.log('Description:', req.body.description);
    console.log('Files:', req.files ? Object.keys(req.files) : 'none');
    
    // Validate required fields
    if (!req.body.name || !req.body.description) {
      console.log('❌ Missing name or description');
      return res.status(400).json({
        success: false,
        message: 'Name and description are required',
      });
    }

    if (!req.body.category) {
      console.log('❌ Missing category');
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    // Transform price fields if they come as flat structure
    const productData = { ...req.body };
    
    // Handle price structure (support both nested and flat formats)
    if (req.body['price[mrp]'] || req.body['price[selling]']) {
      productData.price = {
        mrp: parseFloat(req.body['price[mrp]'] || 0),
        selling: parseFloat(req.body['price[selling]'] || 0),
        discount: parseFloat(req.body['price[discount]'] || 0),
      };
      delete productData['price[mrp]'];
      delete productData['price[selling]'];
      delete productData['price[discount]'];
    } else if (!productData.price && (req.body.mrp || req.body.sellingPrice)) {
      // Handle flat structure from frontend
      productData.price = {
        mrp: parseFloat(req.body.mrp || 0),
        selling: parseFloat(req.body.sellingPrice || req.body.selling || 0),
        discount: parseFloat(req.body.discount || 0),
      };
    } else if (productData.price && typeof productData.price === 'object') {
      // Ensure all price values are numbers if price object exists
      productData.price = {
        mrp: parseFloat(productData.price.mrp || 0),
        selling: parseFloat(productData.price.selling || 0),
        discount: parseFloat(productData.price.discount || 0),
      };
    }

    // Handle shipping structure
    if (req.body['shipping[weight]']) {
      productData.shipping = {
        weight: parseFloat(req.body['shipping[weight]'] || 0),
        dimensions: {
          length: parseFloat(req.body['shipping[dimensions][length]'] || 0),
          width: parseFloat(req.body['shipping[dimensions][width]'] || 0),
          height: parseFloat(req.body['shipping[dimensions][height]'] || 0),
        },
        codAvailable: req.body['shipping[codAvailable]'] === 'true' || req.body['shipping[codAvailable]'] === true,
        deliveryDays: req.body['shipping[deliveryDays]'] || '3-5 days',
      };
      delete productData['shipping[weight]'];
      delete productData['shipping[dimensions][length]'];
      delete productData['shipping[dimensions][width]'];
      delete productData['shipping[dimensions][height]'];
      delete productData['shipping[codAvailable]'];
      delete productData['shipping[deliveryDays]'];
    }

    // Handle attributes structure
    if (req.body['attributes[colors]']) {
      productData.attributes = {
        colors: JSON.parse(req.body['attributes[colors]'] || '[]'),
        material: req.body['attributes[material]'] || '',
        sizes: JSON.parse(req.body['attributes[sizes]'] || '[]'),
        occasion: JSON.parse(req.body['attributes[occasion]'] || '[]'),
        capacity: req.body['attributes[capacity]'] || '',
        closureType: req.body['attributes[closureType]'] || '',
      };
      delete productData['attributes[colors]'];
      delete productData['attributes[material]'];
      delete productData['attributes[sizes]'];
      delete productData['attributes[occasion]'];
      delete productData['attributes[capacity]'];
      delete productData['attributes[closureType]'];
    }

    // Parse JSON strings
    if (typeof productData.tags === 'string') {
      productData.tags = JSON.parse(productData.tags);
    }
    if (typeof productData.features === 'string') {
      productData.features = JSON.parse(productData.features);
    }
    
    // Ensure numeric fields are numbers
    if (productData.stock) productData.stock = parseInt(productData.stock);
    if (productData.lowStockThreshold) productData.lowStockThreshold = parseInt(productData.lowStockThreshold);

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      const mainImageFile = req.files.find(f => f.fieldname === 'mainImage');
      const hoverImageFile = req.files.find(f => f.fieldname === 'hoverImage');
      const imageFiles = req.files.filter(f => f.fieldname === 'images');
      
      if (mainImageFile) {
        productData.mainImage = `/uploads/products/${mainImageFile.filename}`;
      }
      if (hoverImageFile) {
        productData.hoverImage = `/uploads/products/${hoverImageFile.filename}`;
      }
      if (imageFiles.length > 0) {
        productData.images = imageFiles.map(file => ({
          url: `/uploads/products/${file.filename}`,
          alt: productData.name || 'Product image'
        }));
      }
    }

    console.log('✅ Creating product with data:', {
      name: productData.name,
      category: productData.category,
      price: productData.price,
      stock: productData.stock
    });

    const product = await Product.create({
      ...productData,
      createdBy: req.user._id,
    });

    console.log('✅ Product created successfully:', product._id);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : undefined,
    });
  }
});

// Update product
router.put('/:id', auditLog('update', 'Product'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update product fields
    Object.assign(product, req.body);
    
    // Save will trigger pre-save hook to update stockStatus
    await product.save();

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
    
    // Stock status will be auto-updated by the pre-save hook
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
