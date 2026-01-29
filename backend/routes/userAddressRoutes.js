import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/user/addresses
// @desc    Get all user addresses
// @access  Private
router.get('/addresses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');

    res.json({
      success: true,
      data: user.addresses || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/user/addresses
// @desc    Add new address
// @access  Private
router.post('/addresses', protect, async (req, res) => {
  try {
    const { type, name, phone, addressLine, city, state, pincode, isDefault } = req.body;

    const user = await User.findById(req.user._id);

    // If this is set as default, unset all others
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // If this is the first address, make it default
    const makeDefault = user.addresses.length === 0 || isDefault;

    user.addresses.push({
      type,
      name,
      phone,
      addressLine,
      city,
      state,
      pincode,
      isDefault: makeDefault,
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: user.addresses,
      message: 'Address added successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/user/addresses/:id
// @desc    Update address
// @access  Private
router.put('/addresses/:id', protect, async (req, res) => {
  try {
    const { type, name, phone, addressLine, city, state, pincode, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // If setting as default, unset all others
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    address.type = type || address.type;
    address.name = name || address.name;
    address.phone = phone || address.phone;
    address.addressLine = addressLine || address.addressLine;
    address.city = city || address.city;
    address.state = state || address.state;
    address.pincode = pincode || address.pincode;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await user.save();

    res.json({
      success: true,
      data: user.addresses,
      message: 'Address updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/user/addresses/:id
// @desc    Delete address
// @access  Private
router.delete('/addresses/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    const wasDefault = address.isDefault;
    address.remove();

    // If deleted address was default and there are other addresses, make first one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      data: user.addresses,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PATCH /api/user/addresses/:id/default
// @desc    Set address as default
// @access  Private
router.patch('/addresses/:id/default', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // Unset all defaults
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });

    // Set this one as default
    address.isDefault = true;

    await user.save();

    res.json({
      success: true,
      data: user.addresses,
      message: 'Default address updated',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
