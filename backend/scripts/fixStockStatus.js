import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const fixStockStatus = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all products
    const products = await Product.find({});
    console.log(`\n📦 Found ${products.length} products to check\n`);

    let fixed = 0;
    let alreadyCorrect = 0;

    for (const product of products) {
      const currentStatus = product.stockStatus;
      
      // Calculate correct status
      let correctStatus;
      if (product.stock === 0) {
        correctStatus = 'out_of_stock';
      } else if (product.stock <= (product.lowStockThreshold || 10)) {
        correctStatus = 'low_stock';
      } else {
        correctStatus = 'in_stock';
      }

      // Check if needs fixing
      if (currentStatus !== correctStatus) {
        console.log(`🔧 Fixing: ${product.name}`);
        console.log(`   Stock: ${product.stock}`);
        console.log(`   Old Status: ${currentStatus}`);
        console.log(`   New Status: ${correctStatus}\n`);
        
        product.stockStatus = correctStatus;
        await product.save();
        fixed++;
      } else {
        alreadyCorrect++;
      }
    }

    console.log('\n=== SUMMARY ===');
    console.log(`✅ Fixed: ${fixed} products`);
    console.log(`✓  Already correct: ${alreadyCorrect} products`);
    console.log(`📊 Total: ${products.length} products\n`);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixStockStatus();
