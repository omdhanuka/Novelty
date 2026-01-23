import mongoose from 'mongoose';
import Product from '../models/Product.js';

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bagvo');
    console.log('✅ Connected to MongoDB');

    const products = await Product.find().select('name sku attributes.colors attributes.material');
    console.log(`Found ${products.length} products:`);
    products.forEach(p => {
      console.log(`\n- ${p.name} (${p.sku})`);
      console.log(`  Colors: ${JSON.stringify(p.attributes?.colors)}`);
      console.log(`  Material: ${p.attributes?.material}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

check();
