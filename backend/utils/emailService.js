import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  // For development, use ethereal.email (fake SMTP)
  // For production, use real SMTP service like Gmail, SendGrid, etc.
  
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    });
  }
  
  // Default: Use test account (for development)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'test@example.com',
      pass: process.env.EMAIL_PASSWORD || 'testpassword',
    },
  });
};

// Email templates
const getEmailVerificationTemplate = (name, otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .content {
          background: white;
          padding: 30px;
          border-radius: 8px;
        }
        .logo {
          text-align: center;
          font-size: 32px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 20px;
        }
        h1 {
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .otp-box {
          background: #f7fafc;
          border: 2px dashed #667eea;
          padding: 20px;
          text-align: center;
          border-radius: 8px;
          margin: 30px 0;
        }
        .otp {
          font-size: 36px;
          font-weight: bold;
          color: #667eea;
          letter-spacing: 8px;
          font-family: monospace;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #718096;
          font-size: 14px;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 12px;
          margin: 20px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <div class="logo">Bagvo</div>
          <h1>Welcome to Bagvo, ${name}! 👋</h1>
          <p>Thank you for creating an account with us. To complete your registration, please verify your email address using the OTP below:</p>
          
          <div class="otp-box">
            <div style="color: #718096; font-size: 14px; margin-bottom: 10px;">Your Verification Code</div>
            <div class="otp">${otp}</div>
            <div style="color: #718096; font-size: 12px; margin-top: 10px;">Valid for 10 minutes</div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Security Note:</strong> Never share this OTP with anyone. Our team will never ask for this code.
          </div>
          
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Bagvo. All rights reserved.</p>
          <p>Carry Style. Carry Confidence.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getPasswordResetTemplate = (name, otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .content {
          background: white;
          padding: 30px;
          border-radius: 8px;
        }
        .logo {
          text-align: center;
          font-size: 32px;
          font-weight: bold;
          color: #f5576c;
          margin-bottom: 20px;
        }
        h1 {
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .otp-box {
          background: #f7fafc;
          border: 2px dashed #f5576c;
          padding: 20px;
          text-align: center;
          border-radius: 8px;
          margin: 30px 0;
        }
        .otp {
          font-size: 36px;
          font-weight: bold;
          color: #f5576c;
          letter-spacing: 8px;
          font-family: monospace;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #718096;
          font-size: 14px;
        }
        .warning {
          background: #fee;
          border-left: 4px solid #f5576c;
          padding: 12px;
          margin: 20px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <div class="logo">Bagvo</div>
          <h1>Password Reset Request 🔐</h1>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Use the OTP below to proceed:</p>
          
          <div class="otp-box">
            <div style="color: #718096; font-size: 14px; margin-bottom: 10px;">Your Reset Code</div>
            <div class="otp">${otp}</div>
            <div style="color: #718096; font-size: 12px; margin-top: 10px;">Valid for 10 minutes</div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> If you didn't request this password reset, please ignore this email and ensure your account is secure.
          </div>
          
          <p>For your security, this OTP will expire in 10 minutes.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Bagvo. All rights reserved.</p>
          <p>Carry Style. Carry Confidence.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send email verification OTP
export const sendEmailVerificationOTP = async (email, name, otp) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Bagvo" <${process.env.EMAIL_USER || 'noreply@bagvo.com'}>`,
      to: email,
      subject: 'Verify Your Email - Bagvo',
      html: getEmailVerificationTemplate(name, otp),
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email verification sent:', info.messageId);
    // For development with ethereal.email
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset OTP
export const sendPasswordResetOTP = async (email, name, otp) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Bagvo" <${process.env.EMAIL_USER || 'noreply@bagvo.com'}>`,
      to: email,
      subject: 'Reset Your Password - Bagvo',
      html: getPasswordResetTemplate(name, otp),
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Password reset OTP sent:', info.messageId);
    // For development with ethereal.email
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create test account for development
export const createTestAccount = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('Test email account created:');
    console.log('Email:', testAccount.user);
    console.log('Password:', testAccount.pass);
    console.log('\nAdd these to your .env file:');
    console.log(`EMAIL_HOST=smtp.ethereal.email`);
    console.log(`EMAIL_PORT=587`);
    console.log(`EMAIL_USER=${testAccount.user}`);
    console.log(`EMAIL_PASSWORD=${testAccount.pass}`);
    return testAccount;
  } catch (error) {
    console.error('Error creating test account:', error);
  }
};
