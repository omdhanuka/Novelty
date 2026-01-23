import mongoose from 'mongoose';
import Product from '../models/Product.js';

const checkStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bagvo');
    console.log('✅ Connected to MongoDB');

    const products = await Product.find().select('name status attributes.colors');
    console.log(`\nFound ${products.length} products:`);
    products.forEach(p => {
      console.log(`\n- ${p.name}`);
      console.log(`  Status: "${p.status}"`);
      console.log(`  Colors: ${JSON.stringify(p.attributes?.colors)}`);
    });

    // Try the distinct query the API uses
    const colors = await Product.distinct('attributes.colors', { status: 'active' });
    console.log('\n\nDistinct colors with status="active":');
    console.log(JSON.stringify(colors, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkStatus();
