import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import {
  register,
  login,
  getMe,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  updatePassword,
  updateProfile,
  sendVerificationOTP,
  verifyEmailOTP,
  resendVerificationOTP,
} from '../controllers/authController.js';

const router = express.Router();

// Registration with email verification
router.post('/send-verification-otp', sendVerificationOTP);
router.post('/verify-email', verifyEmailOTP);
router.post('/resend-verification-otp', resendVerificationOTP);

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.put('/reset-password/:resetToken', resetPassword);
router.put('/update-password', protect, updatePassword);

// Profile routes
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.put('/profile', protect, updateProfile);

// Change Password (for logged-in users) - convenience endpoint
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
export default router;
