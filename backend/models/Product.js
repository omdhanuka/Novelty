import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    careInstructions: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategory: {
      type: String,
    },
    images: [{
      url: String,
      publicId: String,
      alt: String,
    }],
    mainImage: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    brand: {
      type: String,
    },
    colors: [{
      type: String,
    }],
    sizes: [{
      type: String,
    }],
    material: {
      type: String,
    },
    weight: {
      type: String,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        default: 'cm',
      },
    },
    features: [{
      type: String,
    }],
    tags: [{
      type: String,
    }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'out_of_stock'],
      default: 'active',
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
