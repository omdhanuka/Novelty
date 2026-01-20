import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Category from '../models/Category.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bagshop';

const categories = [
  {
    name: 'Travel Bags',
    slug: 'travel-bags',
    description: 'Durable and spacious bags for all your travel needs',
    type: 'PRODUCT',
    status: 'ACTIVE',
    showOnHomepage: true,
    showInNavbar: true,
    sortOrder: 1,
    seoTitle: 'Travel Bags - Luggage & Travel Accessories',
    seoDescription: 'Shop our collection of travel bags including trolley bags, backpacks, and duffel bags.',
  },
  {
    name: 'Ladies Bags',
    slug: 'ladies-bags',
    description: 'Elegant and stylish bags for modern women',
    type: 'PRODUCT',
    status: 'ACTIVE',
    showOnHomepage: true,
    showInNavbar: true,
    sortOrder: 2,
    seoTitle: 'Ladies Bags - Handbags & Purses Collection',
    seoDescription: 'Discover our premium collection of ladies bags including handbags, sling bags, and purses.',
  },
  {
    name: 'Wedding Collection',
    slug: 'wedding-collection',
    description: 'Exquisite bags and accessories for your special day',
    type: 'COLLECTION',
    status: 'ACTIVE',
    showOnHomepage: true,
    showInNavbar: true,
    sortOrder: 3,
    seoTitle: 'Wedding Collection - Bridal Bags & Clutches',
    seoDescription: 'Browse our exclusive wedding collection featuring dulhan purses and elegant clutches.',
  },
  {
    name: 'Covers',
    slug: 'covers',
    description: 'Protective covers for your valuable garments and items',
    type: 'PRODUCT',
    status: 'ACTIVE',
    showOnHomepage: true,
    showInNavbar: true,
    sortOrder: 4,
    seoTitle: 'Garment Covers - Saree, Suit & Blanket Covers',
    seoDescription: 'Quality covers to protect your sarees, suits, and blankets.',
  },
];

async function seedCategories() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if categories already exist
    const existingCount = await Category.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} categories already exist. Skipping seed.`);
      console.log('To reseed, delete existing categories first or modify this script.');
      process.exit(0);
    }

    console.log('Creating categories...');
    const created = await Category.insertMany(categories);
    console.log(`✅ Created ${created.length} categories:`);
    created.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });

    console.log('\n✨ Category seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error.message);
    process.exit(1);
  }
}

seedCategories();
