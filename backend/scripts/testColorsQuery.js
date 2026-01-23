import mongoose from 'mongoose';
import Product from '../models/Product.js';

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bagvo');
    console.log('✅ Connected to MongoDB');

    // Test distinct colors
    const colors = await Product.distinct('attributes.colors', { status: 'active' });
    console.log('\nDistinct colors (raw):', colors);
    console.log('Colors count:', colors.length);
    console.log('Colors filtered:', colors.filter(Boolean));

    // Test distinct materials
    const materials = await Product.distinct('attributes.material', { status: 'active' });
    console.log('\nDistinct materials:', materials);
    console.log('Materials filtered:', materials.filter(Boolean));

    // Also check all products
    const products = await Product.find({ status: 'active' }).select('name attributes.colors attributes.material');
    console.log('\nAll active products:');
    products.forEach(p => {
      console.log(`- ${p.name}`);
      console.log(`  Colors: ${JSON.stringify(p.attributes?.colors)}`);
      console.log(`  Material: ${p.attributes?.material}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

test();
