import mongoose from 'mongoose';
import Product from '../models/Product.js';

const fixProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bagvo');
    console.log('✅ Connected to MongoDB');

    // Find products with malformed colors
    const malformed = await Product.find({ 'attributes.colors': '[]' });
    console.log(`\nFound ${malformed.length} products with malformed colors:`);
    malformed.forEach(p => {
      console.log(`  - ${p.name} (${p.sku})`);
    });

    if (malformed.length > 0) {
      console.log('\n🗑️  Deleting products with malformed colors...');
      const result = await Product.deleteMany({ 'attributes.colors': '[]' });
      console.log(`✅ Deleted ${result.deletedCount} malformed products`);
    }

    // Show remaining products
    const remaining = await Product.find().select('name sku attributes.colors attributes.material').limit(10);
    console.log(`\n📦 Remaining ${remaining.length} products:`);
    remaining.forEach(p => {
      console.log(`  - ${p.name}`);
      console.log(`    Colors: ${JSON.stringify(p.attributes?.colors)}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixProducts();
