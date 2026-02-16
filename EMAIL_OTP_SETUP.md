# Email OTP Verification Setup Guide

This application now uses email OTP (One-Time Password) verification for:
1. **Account Registration** - Users must verify their email before logging in
2. **Password Reset** - Users receive OTP to verify their identity before resetting password

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Email Service

Add these environment variables to your `backend/.env` file:

#### Option A: Using Gmail (Recommended for Production)
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Note:** For Gmail, you need to generate an **App Password**:
1. Go to Google Account Settings
2. Security → 2-Step Verification (enable if not already)
3. App Passwords → Generate new app password
4. Use this 16-character password in `EMAIL_PASSWORD`

#### Option B: Using Other SMTP Providers
```env
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

#### Option C: Development/Testing (Ethereal Email)
For development, you can use test email accounts:
```bash
cd backend
node -e "require('./utils/emailService.js').createTestAccount()"
```

This will generate test credentials you can add to your `.env` file.

### 3. Start Backend Server
```bash
cd backend
npm run dev
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Frontend Server
```bash
npm run dev
```

## How It Works

### Registration Flow
1. User fills registration form
2. System sends 6-digit OTP to user's email
3. User enters OTP on verification page
4. Account is created and verified
5. User can now login

### Password Reset Flow
1. User enters email on forgot password page
2. System sends 6-digit OTP to user's email
3. User enters OTP on verification page
4. User is redirected to reset password page
5. User sets new password

### Login Flow
- If user hasn't verified email, they're redirected to verification page
- Otherwise, normal login proceeds

## API Endpoints

### Authentication with OTP
- `POST /api/auth/send-verification-otp` - Send OTP for email verification
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/resend-verification-otp` - Resend verification OTP
- `POST /api/auth/forgot-password` - Send OTP for password reset
- `POST /api/auth/verify-reset-otp` - Verify reset OTP
- `PUT /api/auth/reset-password/:token` - Reset password with token

### Legacy Endpoints (Still Available)
- `POST /api/auth/register` - Direct registration without OTP
- `POST /api/auth/login` - Login

## Email Templates

The system includes beautiful HTML email templates with:
- Branded design (Bagvo theme)
- Responsive layout
- Clear OTP display
- Security warnings
- Company branding

## Development Mode

In development (`NODE_ENV !== 'production'):
- API responses include the OTP for testing
- Email preview URLs are logged to console (when using Ethereal)
- You can see the exact OTP without checking email

## Security Features

- OTPs expire after 10 minutes
- OTPs are 6-digit random numbers
- OTPs are hashed before storage
- Email verification required before login
- Resend cooldown (60 seconds)
- Rate limiting recommended for production

## Testing

### Test Registration
1. Go to `/register`
2. Fill in details
3. Check backend console for OTP (dev mode)
4. Enter OTP on verification page

### Test Password Reset
1. Go to `/forgot-password`
2. Enter email
3. Check backend console for OTP (dev mode)
4. Enter OTP on verification page
5. Set new password

## Production Checklist

Before deploying to production:

- [ ] Set up real email service (Gmail, SendGrid, etc.)
- [ ] Remove OTP from API responses (check controller)
- [ ] Set `NODE_ENV=production`
- [ ] Enable rate limiting on auth endpoints
- [ ] Set up email delivery monitoring
- [ ] Configure CORS properly
- [ ] Use HTTPS for all endpoints
- [ ] Set secure JWT_SECRET
- [ ] Configure email SPF/DKIM records

## Troubleshooting

### Emails Not Sending
1. Check `.env` configuration
2. Verify email credentials
3. Check firewall/network settings
4. For Gmail: Ensure App Password is used
5. Check console for error messages

### OTP Not Working
1. Check OTP hasn't expired (10 minutes)
2. Verify email address matches
3. Check for typos in OTP entry
4. Try resending OTP

### Can't Login
1. Verify email first
2. Check if account exists
3. Ensure password is correct
4. Check browser console for errors

## Support

For issues or questions:
- Check backend logs: `backend/` directory
- Check frontend console: Browser Developer Tools
- Verify database connection
- Ensure all dependencies are installed

## File Structure

```
backend/
├── controllers/
│   └── authController.js      # OTP logic included
├── models/
│   └── User.js                # OTP fields added
├── routes/
│   └── authRoutes.js          # OTP routes added
└── utils/
    └── emailService.js        # Email sending utility (NEW)

frontend/
├── components/
│   └── OTPInput.jsx           # Reusable OTP input (NEW)
├── pages/
│   ├── Register.jsx           # Updated for OTP
│   ├── Login.jsx              # Updated for verification
│   ├── ForgotPassword.jsx     # Updated for OTP
│   ├── VerifyEmail.jsx        # Email verification page (NEW)
│   └── VerifyResetOTP.jsx     # Password reset OTP page (NEW)
└── context/
    └── AuthContext.jsx        # Updated for verification flow
```
