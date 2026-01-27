import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Settings from '../models/Settings.js';

dotenv.config();

// Security check - only allow in development
if (process.env.NODE_ENV === 'production') {
  console.error('❌ This script cannot be run in production environment for security reasons!');
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bagshop';

const setupAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@bagvo.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'BAGVO Admin',
      email: 'admin@bagvo.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin',
      isActive: true,
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    console.log('👤 Role:', admin.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');

    // Create default settings if not exists
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create({
        storeName: 'BAGVO',
        shipping: {
          charges: 0,
          freeShippingThreshold: 1000,
          codCharges: 50,
          codAvailable: true,
        },
        gst: {
          percentage: 18,
        },
      });
      console.log('✅ Default settings created');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

setupAdmin();
