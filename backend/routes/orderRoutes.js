import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

// Create new order
router.post('/', protect, createOrder);

// Get all orders
router.get('/', protect, getAllOrders);

// Get single order by ID
router.get('/:id', protect, getOrderById);

// Update order status
router.put('/:id/status', protect, updateOrderStatus);

export default router;
