import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Basic Information
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
    shortDescription: {
      type: String,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    
    // Category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategory: {
      type: String,
    },
    brand: {
      type: String,
    },
    tags: [{
      type: String,
    }],

    // Pricing & Stock
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    price: {
      mrp: {
        type: Number,
        required: true,
        min: 0,
      },
      selling: {
        type: Number,
        required: true,
        min: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    stockStatus: {
      type: String,
      enum: ['in_stock', 'out_of_stock', 'low_stock'],
      default: 'in_stock',
    },

    // Images
    images: [{
      url: String,
      publicId: String,
      alt: String,
    }],
    mainImage: {
      type: String,
    },
    hoverImage: {
      type: String,
    },
    videoUrl: {
      type: String,
    },

    // Product Attributes
    attributes: {
      colors: [{
        type: String,
      }],
      material: {
        type: String,
      },
      sizes: [{
        type: String,
      }],
      occasion: [{
        type: String,
      }],
      capacity: {
        type: String,
      },
      closureType: {
        type: String,
      },
    },

    // Shipping & Delivery
    shipping: {
      weight: {
        type: Number, // in kg
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
      codAvailable: {
        type: Boolean,
        default: true,
      },
      deliveryDays: {
        type: String,
        default: '3-5 days',
      },
    },

    // SEO
    seo: {
      metaTitle: {
        type: String,
      },
      metaDescription: {
        type: String,
      },
      keywords: [{
        type: String,
      }],
    },

    // Status & Visibility Flags
    status: {
      type: String,
      enum: ['active', 'draft', 'out_of_stock'],
      default: 'draft',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    showOnHomepage: {
      type: Boolean,
      default: false,
    },

    // Additional Fields
    careInstructions: {
      type: String,
    },
    features: [{
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
    sold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Auto-calculate discount percentage
  if (this.price.mrp && this.price.selling) {
    this.price.discount = Math.round(((this.price.mrp - this.price.selling) / this.price.mrp) * 100);
  }
  
  // Auto-update stock status
  if (this.stock === 0) {
    this.stockStatus = 'out_of_stock';
  } else if (this.stock <= this.lowStockThreshold) {
    this.stockStatus = 'low_stock';
  } else {
    this.stockStatus = 'in_stock';
  }
  
  // Clean up colors - ensure no nested JSON strings
  if (this.attributes && this.attributes.colors && Array.isArray(this.attributes.colors)) {
    this.attributes.colors = this.attributes.colors
      .map(color => {
        // If color is a JSON string, parse it
        if (typeof color === 'string' && (color.trim().startsWith('[') || color.trim().startsWith('{'))) {
          try {
            const parsed = JSON.parse(color);
            return Array.isArray(parsed) ? parsed : color;
          } catch (e) {
            return color;
          }
        }
        return color;
      })
      .flat()
      .filter(c => c && c !== '[]' && c !== '{}' && c !== '');
  }
  
  next();
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
