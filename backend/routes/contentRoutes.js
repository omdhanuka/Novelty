import express from 'express';
import { getHomeContent, getPublicSettings } from '../controllers/contentController.js';

const router = express.Router();

// Public route to get home content
router.get('/', getHomeContent);

// Public route to get settings (for invoices)
router.get('/settings', getPublicSettings);

export default router;
