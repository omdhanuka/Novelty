import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { 
  generateOTP, 
  sendEmailVerificationOTP, 
  sendPasswordResetOTP 
} from '../utils/emailService.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Send OTP for email verification during registration
// @route   POST /api/auth/send-verification-otp
// @access  Public
export const sendVerificationOTP = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered. Please login.',
        });
      }
      // User exists but not verified, check rate limiting
      const now = Date.now();
      if (existingUser.lastOTPRequestTime && (now - existingUser.lastOTPRequestTime.getTime()) < 60000) {
        const remainingTime = Math.ceil((60000 - (now - existingUser.lastOTPRequestTime.getTime())) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingTime} seconds before requesting another OTP`,
          remainingTime,
        });
      }

      // Check 24-hour limit
      if (existingUser.otpRequestResetTime && (now - existingUser.otpRequestResetTime.getTime()) > 24 * 60 * 60 * 1000) {
        existingUser.otpRequestCount = 0;
        existingUser.otpRequestResetTime = now;
      } else if (!existingUser.otpRequestResetTime) {
        existingUser.otpRequestResetTime = now;
        existingUser.otpRequestCount = 0;
      }

      if (existingUser.otpRequestCount >= 3) {
        const timeUntilReset = Math.ceil((24 * 60 * 60 * 1000 - (now - existingUser.otpRequestResetTime.getTime())) / 1000 / 60);
        return res.status(429).json({
          success: false,
          message: `You have exceeded the maximum OTP requests. Please try again in ${timeUntilReset} minutes`,
          limitExceeded: true,
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    const now = Date.now();

    // If user exists but not verified, update OTP
    if (existingUser) {
      existingUser.emailVerificationOTP = otp;
      existingUser.emailVerificationOTPExpiry = otpExpiry;
      existingUser.name = name;
      existingUser.password = password;
      if (phone) existingUser.phone = phone;
      existingUser.lastOTPRequestTime = now;
      existingUser.otpRequestCount += 1;
      await existingUser.save();
    } else {
      // Create new user (unverified)
      await User.create({
        name,
        email: email.toLowerCase(),
        password,
        phone,
        isVerified: false,
        emailVerificationOTP: otp,
        emailVerificationOTPExpiry: otpExpiry,
        lastOTPRequestTime: now,
        otpRequestCount: 1,
        otpRequestResetTime: now,
      });
    }

    // Send OTP email
    const emailResult = await sendEmailVerificationOTP(email, name, otp);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification OTP sent to your email',
      email: email.toLowerCase(),
      // For development only - remove in production
      ...(process.env.NODE_ENV !== 'production' && { otp }),
    });
  } catch (error) {
    console.error('Send verification OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify email OTP and complete registration
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP',
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
      emailVerificationOTP: otp,
      emailVerificationOTPExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // Verify user
    user.isVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpiry = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (error) {
    console.error('Verify email OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Resend verification OTP
// @route   POST /api/auth/resend-verification-otp
// @access  Public
export const resendVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified. Please login.',
      });
    }

    // Rate limiting: Check if last request was within 1 minute
    const now = Date.now();
    if (user.lastOTPRequestTime && (now - user.lastOTPRequestTime.getTime()) < 60000) {
      const remainingTime = Math.ceil((60000 - (now - user.lastOTPRequestTime.getTime())) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${remainingTime} seconds before requesting another OTP`,
        remainingTime,
      });
    }

    // Rate limiting: Check 24-hour limit (3 attempts per 24 hours)
    if (user.otpRequestResetTime && (now - user.otpRequestResetTime.getTime()) > 24 * 60 * 60 * 1000) {
      // Reset counter after 24 hours
      user.otpRequestCount = 0;
      user.otpRequestResetTime = now;
    } else if (!user.otpRequestResetTime) {
      // First time request
      user.otpRequestResetTime = now;
      user.otpRequestCount = 0;
    }

    // Check if limit exceeded
    if (user.otpRequestCount >= 3) {
      const timeUntilReset = Math.ceil((24 * 60 * 60 * 1000 - (now - user.otpRequestResetTime.getTime())) / 1000 / 60);
      return res.status(429).json({
        success: false,
        message: `You have exceeded the maximum OTP requests. Please try again in ${timeUntilReset} minutes`,
        limitExceeded: true,
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.emailVerificationOTP = otp;
    user.emailVerificationOTPExpiry = Date.now() + 10 * 60 * 1000;
    user.lastOTPRequestTime = Date.now();
    user.otpRequestCount += 1;
    await user.save();

    // Send OTP email
    const emailResult = await sendEmailVerificationOTP(email, user.name, otp);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification OTP resent to your email',
      ...(process.env.NODE_ENV !== 'production' && { otp }),
    });
  } catch (error) {
    console.error('Resend verification OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user (only if email is verified)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in',
        needsVerification: true,
        email: user.email,
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Send OTP for password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log('Forgot password request for:', email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    console.log('User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User isVerified:', user.isVerified);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email',
      });
    }

    // For existing users without isVerified field, set it to true
    if (user.isVerified === undefined || user.isVerified === null) {
      user.isVerified = true;
      await user.save();
    }

    // NOTE: Allow password reset regardless of email verification status.
    // This supports legacy accounts created before email verification was enforced.
    console.log('Proceeding with password reset (verification not required).');

    // Rate limiting: Check if last request was within 1 minute
    const now = Date.now();
    if (user.lastOTPRequestTime && (now - user.lastOTPRequestTime.getTime()) < 60000) {
      const remainingTime = Math.ceil((60000 - (now - user.lastOTPRequestTime.getTime())) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${remainingTime} seconds before requesting another OTP`,
        remainingTime,
      });
    }

    // Rate limiting: Check 24-hour limit (3 attempts per 24 hours)
    if (user.otpRequestResetTime && (now - user.otpRequestResetTime.getTime()) > 24 * 60 * 60 * 1000) {
      // Reset counter after 24 hours
      user.otpRequestCount = 0;
      user.otpRequestResetTime = now;
    } else if (!user.otpRequestResetTime) {
      // First time request
      user.otpRequestResetTime = now;
      user.otpRequestCount = 0;
    }

    // Check if limit exceeded
    if (user.otpRequestCount >= 3) {
      const timeUntilReset = Math.ceil((24 * 60 * 60 * 1000 - (now - user.otpRequestResetTime.getTime())) / 1000 / 60);
      return res.status(429).json({
        success: false,
        message: `You have exceeded the maximum OTP requests. Please try again in ${timeUntilReset} minutes`,
        limitExceeded: true,
      });
    }

    // Generate OTP
    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.lastOTPRequestTime = Date.now();
    user.otpRequestCount += 1;
    await user.save();

    // Send OTP email
    const emailResult = await sendPasswordResetOTP(email, user.name, otp);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send reset email',
      });
    }

    res.json({
      success: true,
      message: 'Password reset OTP sent to your email',
      email: email.toLowerCase(),
      ...(process.env.NODE_ENV !== 'production' && { otp }),
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify OTP for password reset
// @route   POST /api/auth/verify-reset-otp
// @access  Public
export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP',
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordOTP: otp,
      resetPasswordOTPExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // Generate a temporary reset token for next step
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'OTP verified successfully',
      resetToken, // Use this to reset password
    });
  } catch (error) {
    console.error('Verify reset OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reset password with token
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;
    
    // Accept either 'password' or 'newPassword' from frontend
    const newPass = password || newPassword;
    
    // Validation
    if (!newPass) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    if (confirmPassword && newPass !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (newPass.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Set new password
    user.password = newPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Password reset successful',
      token,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Password updated successfully',
      token,
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, gender, dateOfBirth } = req.body;

    console.log(`[updateProfile] userId=${req.user?._id} body=`, req.body);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (gender) user.gender = gender;
    if (dateOfBirth) {
      // Coerce incoming date string to a Date object when possible
      const parsed = new Date(dateOfBirth);
      if (!isNaN(parsed)) {
        user.dateOfBirth = parsed;
      } else {
        console.warn(`[updateProfile] invalid dateOfBirth provided for user ${req.user?._id}:`, dateOfBirth);
      }
    }

    // Normalize address types to lowercase to prevent validation errors
    user.addresses.forEach((addr) => {
      if (addr.type) {
        addr.type = addr.type.toLowerCase();
      }
    });

    try {
      await user.save();
      console.log('[updateProfile] Profile saved successfully');
    } catch (saveErr) {
      console.error('[updateProfile] error saving user:', saveErr);
      throw saveErr;
    }

    const responseData = {
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
    
    console.log('[updateProfile] Sending response:', JSON.stringify(responseData));
    res.json(responseData);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Legacy register function (keeping for backward compatibility)
// @desc    Register new user (deprecated - use send-verification-otp instead)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      isVerified: false, // Set to false by default
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
