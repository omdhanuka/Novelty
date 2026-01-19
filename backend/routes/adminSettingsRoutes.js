import express from 'express';
import { protect, authorize, auditLog } from '../middleware/auth.js';
import Settings from '../models/Settings.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

// Get settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update settings
router.put('/', auditLog('update', 'Settings'), async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.json({
      success: true,
      data: settings,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Update specific setting section
router.patch('/:section', auditLog('update_section', 'Settings'), async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    const validSections = [
      'storeName',
      'storeEmail',
      'storePhone',
      'storeAddress',
      'gst',
      'businessHours',
      'shipping',
      'razorpay',
      'emailSettings',
      'seo',
      'socialMedia',
      'heroBanner',
      'homepageSections',
      'invoiceSettings',
    ];

    const section = req.params.section;

    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid settings section',
      });
    }

    settings[section] = { ...settings[section], ...req.body };
    await settings.save();

    res.json({
      success: true,
      data: settings,
      message: `${section} updated successfully`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
