import express from 'express';
import { getHomeContent } from '../controllers/contentController.js';

const router = express.Router();

// Public route to get home content
router.get('/', getHomeContent);

export default router;
