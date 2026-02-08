import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

// User routes
import userOrderRoutes from './routes/userOrderRoutes.js';
import userWishlistRoutes from './routes/userWishlistRoutes.js';
import userAddressRoutes from './routes/userAddressRoutes.js';

// Admin routes
import adminRoutes from './routes/adminRoutes.js';
import adminProductRoutes from './routes/adminProductRoutes.js';
import adminOrderRoutes from './routes/adminOrderRoutes.js';
import adminCouponRoutes from './routes/adminCouponRoutes.js';
import adminCustomerRoutes from './routes/adminCustomerRoutes.js';
import adminCategoryRoutes from './routes/adminCategoryRoutes.js';
import adminSettingsRoutes from './routes/adminSettingsRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import adminContentRoutes from './routes/adminContentRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// Public routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/content', contentRoutes);

// User routes
app.use('/api/user', userOrderRoutes);
app.use('/api/user', userWishlistRoutes);
app.use('/api/user', userAddressRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/coupons', adminCouponRoutes);
app.use('/api/admin/customers', adminCustomerRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/content', adminContentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BagShop API is running' });
});

// Data status check
app.get('/api/status', async (req, res) => {
  try {
    const Category = mongoose.model('Category');
    const Product = mongoose.model('Product');
    
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();
    
    res.json({
      status: 'OK',
      data: {
        categories: categoryCount,
        products: productCount,
        message: categoryCount === 0 ? 'Please run: node scripts/seedCategories.js && node scripts/addSampleProducts.js' : 'Data is available'
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Database connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bagshop';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export default app;
