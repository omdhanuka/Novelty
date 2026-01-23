import mongoose from 'mongoose';
import Product from '../models/Product.js';

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bagvo');
    console.log('✅ Connected to MongoDB');

    const result = await Product.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} products`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

cleanup();
