import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  sendVerificationOTP,
  verifyEmailOTP,
  resendVerificationOTP,
  verifyResetOTP,
} from '../controllers/authController.js';

const router = express.Router();

// Registration with email verification
router.post('/send-verification-otp', sendVerificationOTP);
router.post('/verify-email', verifyEmailOTP);
router.post('/resend-verification-otp', resendVerificationOTP);

// Legacy registration (without OTP)
router.post('/register', register);

// Login
router.post('/login', login);

// Password reset with OTP
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.put('/reset-password/:resetToken', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.put('/profile', protect, updateProfile);

export default router;
