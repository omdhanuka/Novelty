import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
    
    // Images
    image: {
      type: String, // Thumbnail image (500x500)
    },
    bannerImage: {
      type: String, // Banner image (1200x400)
    },
    
    // Hierarchy
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    subcategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }],
    
    // Category Type
    type: {
      type: String,
      enum: ['PRODUCT', 'COLLECTION', 'OCCASION'],
      default: 'PRODUCT',
    },
    
    // Display Controls
    status: {
      type: String,
      enum: ['ACTIVE', 'HIDDEN'],
      default: 'ACTIVE',
    },
    showOnHomepage: {
      type: Boolean,
      default: true,
    },
    showInNavbar: {
      type: Boolean,
      default: true,
    },
    showInFooter: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    
    // SEO
    seoTitle: {
      type: String,
    },
    seoDescription: {
      type: String,
    },
    seoKeywords: {
      type: String,
    },
    
    // Legacy field support
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
