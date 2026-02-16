import express from 'express';
import { protect } from '../middleware/auth.js';
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
  verifyResetOTP,
} from '../controllers/authController.js';

const router = express.Router();

<<<<<<< Updated upstream
// Registration with email verification
router.post('/send-verification-otp', sendVerificationOTP);
router.post('/verify-email', verifyEmailOTP);
router.post('/resend-verification-otp', resendVerificationOTP);
=======
// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.put('/reset-password/:resetToken', resetPassword);
router.put('/update-password', protect, updatePassword);
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
=======
// Change Password (for logged-in users)
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'New passwords do not match' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

>>>>>>> Stashed changes
export default router;
