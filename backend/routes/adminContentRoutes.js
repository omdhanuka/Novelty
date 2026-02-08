import express from 'express';
import {
  getAdminHomeContent,
  updateSectionVisibility,
  addHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
  addBanner,
  updateBanner,
  deleteBanner,
  updateBrandStory,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  addFeature,
  updateFeature,
  deleteFeature,
} from '../controllers/contentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Get all content (admin view)
router.get('/', getAdminHomeContent);

// Section visibility
router.put('/sections', updateSectionVisibility);

// Hero slides
router.post('/hero', addHeroSlide);
router.put('/hero/reorder', reorderHeroSlides);
router.put('/hero/:id', updateHeroSlide);
router.delete('/hero/:id', deleteHeroSlide);

// Banners
router.post('/banner', addBanner);
router.put('/banner/:id', updateBanner);
router.delete('/banner/:id', deleteBanner);

// Brand story
router.put('/brand-story', updateBrandStory);

// Testimonials
router.post('/testimonial', addTestimonial);
router.put('/testimonial/:id', updateTestimonial);
router.delete('/testimonial/:id', deleteTestimonial);

// Features
router.post('/feature', addFeature);
router.put('/feature/:id', updateFeature);
router.delete('/feature/:id', deleteFeature);

export default router;
