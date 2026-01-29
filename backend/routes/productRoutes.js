import express from 'express';
import {
  getProducts,
  getProductById,
  getRelatedProducts,
} from '../controllers/productController.js';

const router = express.Router();

// Get all products with filtering
router.get('/', getProducts);

// Get single product
router.get('/:id', getProductById);

// Get related products
router.get('/:id/related', getRelatedProducts);

export default router;
