import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import OTPInput from '../components/OTPInput';
import { api } from '../lib/api';

const VerifyResetOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (otpValue = otp) => {
    if (!otpValue || otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/verify-reset-otp', {
        email,
        otp: otpValue,
      });

      if (response.data.success) {
        // Navigate to reset password page with token
        navigate(`/reset-password/${response.data.resetToken}`, {
          state: { email },
        });
      } else {
        setError(response.data.message || 'Verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setError('');

    try {
      const response = await api.post('/auth/forgot-password', { email });

      if (response.data.success) {
        setCountdown(60);
        setOtp('');
        alert('New OTP sent to your email!');
      } else {
        setError(response.data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - Brand */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <Link to="/" className="inline-block">
              <h1 className="font-heading text-5xl text-white tracking-tight mb-2">Bagvo</h1>
            </Link>
          </div>

          <div className="space-y-8">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl font-bold leading-tight mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Secure Reset
                <br />
                Process.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg text-gray-300 leading-relaxed"
              >
                Enter the verification code we sent to your email to proceed with password reset.
              </motion.p>
            </div>
          </div>

          <div className="text-sm text-gray-400">© 2024 Bagvo. All rights reserved.</div>
        </div>
      </motion.div>

      {/* RIGHT SIDE - Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white"
      >
        <div className="max-w-md w-full space-y-8">
          {/* Back Link */}
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          {/* Header */}
          <div>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} className="text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 text-center">Enter Verification Code</h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              We've sent a 6-digit code to
              <br />
              <span className="font-semibold text-gray-900">{email}</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-red-50 border border-red-200 p-4 text-center"
            >
              <p className="text-sm text-red-800">{error}</p>
            </motion.div>
          )}

          {/* OTP Input */}
          <div className="space-y-6">
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              onComplete={handleVerify}
            />

            {/* Verify Button */}
            <motion.button
              onClick={() => handleVerify()}
              disabled={loading || otp.length !== 6}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-400 to-blue-700 hover:from-blue-500 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify & Continue'
              )}
            </motion.button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
              <button
                onClick={handleResendOTP}
                disabled={countdown > 0}
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw size={16} />
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyResetOTP;
