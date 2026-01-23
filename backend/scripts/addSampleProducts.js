import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const sampleProducts = [
  {
    name: 'Premium Leather Trolley Bag',
    slug: 'premium-leather-trolley-bag',
    shortDescription: 'Spacious 24-inch trolley with smooth wheels',
    description: 'High-quality leather trolley bag perfect for travel. Features include 360° spinner wheels, TSA-approved lock, expandable compartments, and water-resistant exterior.',
    brand: 'BAGVO',
    sku: 'BAG-001',
    price: {
      mrp: 5999,
      selling: 3999
    },
    stock: 25,
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&h=800&fit=crop',
        alt: 'Premium Leather Trolley Bag Front View'
      },
      { 
        url: 'https://images.unsplash.com/photo-1591561954555-607968d87b84?w=800&h=800&fit=crop',
        alt: 'Trolley Bag Side View'
      }
    ],
    mainImage: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&h=800&fit=crop',
    attributes: {
      colors: ['Black', 'Brown', 'Navy'],
      material: 'Genuine Leather',
      capacity: '24 inches',
      closureType: 'Zipper'
    },
    shipping: {
      codAvailable: true,
      deliveryDays: '3-5 days',
      weight: 3.5
    },
    features: [
      '360° spinner wheels',
      'TSA-approved lock',
      'Expandable compartments',
      'Water-resistant exterior',
      'Multiple pockets'
    ],
    careInstructions: 'Wipe with damp cloth. Avoid prolonged exposure to water.',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    status: 'active',
    rating: 4.5,
    numReviews: 128
  },
  {
    name: 'Elegant Handbag for Women',
    slug: 'elegant-handbag-for-women',
    shortDescription: 'Stylish and spacious everyday handbag',
    description: 'Beautiful handbag crafted from premium materials. Perfect for daily use with multiple compartments for organization.',
    brand: 'BAGVO',
    sku: 'BAG-002',
    price: {
      mrp: 2999,
      selling: 1999
    },
    stock: 45,
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop',
        alt: 'Elegant Handbag Front'
      },
      { 
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop',
        alt: 'Handbag Detail View'
      }
    ],
    mainImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop',
    attributes: {
      colors: ['Beige', 'Black', 'Brown', 'Red'],
      material: 'PU Leather',
      capacity: 'Medium'
    },
    shipping: {
      codAvailable: true,
      deliveryDays: '2-4 days',
      weight: 0.8
    },
    features: [
      'Multiple compartments',
      'Detachable shoulder strap',
      'Gold-tone hardware',
      'Interior zip pocket'
    ],
    careInstructions: 'Clean with soft cloth. Store in dust bag when not in use.',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    status: 'active',
    rating: 4.7,
    numReviews: 89
  },
  {
    name: 'Spacious Duffel Bag',
    slug: 'spacious-duffel-bag',
    shortDescription: 'Perfect weekend travel companion',
    description: 'Large capacity duffel bag ideal for weekend trips and gym sessions. Durable construction with comfortable handles.',
    brand: 'BAGVO',
    sku: 'BAG-003',
    price: {
      mrp: 3499,
      selling: 2299
    },
    stock: 30,
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
        alt: 'Duffel Bag'
      },
      { 
        url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=800&fit=crop',
        alt: 'Duffel Bag Open'
      }
    ],
    mainImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
    attributes: {
      colors: ['Black', 'Navy', 'Gray'],
      material: 'Canvas',
      capacity: '50L'
    },
    shipping: {
      codAvailable: true,
      deliveryDays: '3-5 days',
      weight: 1.2
    },
    features: [
      'Large main compartment',
      'Shoe compartment',
      'Padded shoulder strap',
      'Water-resistant base'
    ],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    status: 'active',
    rating: 4.3,
    numReviews: 56
  },
  {
    name: 'Professional Laptop Backpack',
    slug: 'professional-laptop-backpack',
    shortDescription: 'Ergonomic design with laptop compartment',
    description: 'Modern backpack designed for professionals. Features dedicated laptop compartment, USB charging port, and ergonomic design.',
    brand: 'BAGVO',
    sku: 'BAG-004',
    price: {
      mrp: 4999,
      selling: 3499
    },
    stock: 20,
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
        alt: 'Laptop Backpack'
      }
    ],
    mainImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
    attributes: {
      colors: ['Black', 'Gray', 'Blue'],
      material: 'Polyester',
      capacity: '15.6 inch laptop'
    },
    shipping: {
      codAvailable: true,
      deliveryDays: '2-4 days',
      weight: 1.0
    },
    features: [
      'Padded laptop compartment',
      'USB charging port',
      'Water-resistant material',
      'Anti-theft pocket',
      'Ergonomic straps'
    ],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    status: 'active',
    rating: 4.6,
    numReviews: 73
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bagvo');
    console.log('✅ Connected to MongoDB');

    // Get or create a category
    let category = await Category.findOne({ name: 'Travel Bags' });
    
    if (!category) {
      console.log('📦 Creating Travel Bags category...');
      category = await Category.create({
        name: 'Travel Bags',
        slug: 'travel-bags',
        description: 'Premium travel bags for all your journey needs',
        isActive: true
      });
    }

    // Add category to products
    const productsWithCategory = sampleProducts.map(p => ({
      ...p,
      category: category._id
    }));

    // Clear existing sample products (optional)
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({ sku: { $in: ['BAG-001', 'BAG-002', 'BAG-003', 'BAG-004'] } });

    // Insert new products
    console.log('📦 Adding sample products...');
    const inserted = await Product.insertMany(productsWithCategory);
    
    console.log(`✅ Successfully added ${inserted.length} products!`);
    console.log('\nProducts:');
    inserted.forEach(p => {
      console.log(`  - ${p.name} (₹${p.price.selling})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedProducts();
