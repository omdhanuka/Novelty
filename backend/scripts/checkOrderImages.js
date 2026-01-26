import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import 'dotenv/config';

const checkOrderImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/novelty');
    console.log('Connected to MongoDB');

    const orders = await Order.find()
      .populate('items.product', 'name images mainImage')
      .limit(3);

    console.log('\n=== Order Image Data ===\n');
    
    for (const order of orders) {
      console.log(`Order: ${order.orderNumber}`);
      console.log(`Items count: ${order.items.length}`);
      
      for (const item of order.items) {
        console.log(`\n  Item: ${item.name}`);
        console.log(`  - item.image: ${item.image || 'NOT SET'}`);
        console.log(`  - item.product exists: ${!!item.product}`);
        
        if (item.product) {
          console.log(`  - product.mainImage: ${item.product.mainImage || 'NOT SET'}`);
          console.log(`  - product.images: ${JSON.stringify(item.product.images)}`);
        }
      }
      console.log('\n---\n');
    }

    await mongoose.connection.close();
    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkOrderImages();
