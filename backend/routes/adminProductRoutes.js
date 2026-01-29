import express from 'express';
import { protect, authorize, auditLog } from '../middleware/auth.js';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} from '../controllers/adminProductController.js';
import Product from '../models/Product.js';
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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const imageFields = ['mainImage', 'images', 'hoverImage'];
    
    if (!imageFields.includes(file.fieldname) || !file.originalname || file.size === 0) {
      return cb(null, false);
    }
    
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const mimetype = file.mimetype && filetypes.test(file.mimetype);
    const extname = file.originalname && filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(null, false);
  },
});

// Product CRUD routes
router.get('/', getAllProducts);
router.post('/', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'hoverImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), auditLog('create', 'Product'), createProduct);

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

router.put('/:id', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'hoverImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), auditLog('update', 'Product'), updateProduct);

router.delete('/:id', auditLog('delete', 'Product'), deleteProduct);
router.put('/:id/stock', auditLog('update', 'Stock'), updateStock);

// Bulk operations
router.post('/bulk-upload', authorize('admin'), async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required',
      });
    }

    const results = { success: [], failed: [] };

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
      message: `${results.success.length} products uploaded, ${results.failed.length} failed`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
