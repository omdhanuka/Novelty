import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'BAGVO',
    },
    storeEmail: {
      type: String,
    },
    storePhone: {
      type: String,
    },
    storeAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: 'India',
      },
    },
    gst: {
      number: String,
      percentage: {
        type: Number,
        default: 18,
      },
    },
    businessHours: {
      weekdays: String,
      weekends: String,
    },
    shipping: {
      charges: {
        type: Number,
        default: 0,
      },
      freeShippingThreshold: {
        type: Number,
        default: 1000,
      },
      codCharges: {
        type: Number,
        default: 50,
      },
      codAvailable: {
        type: Boolean,
        default: true,
      },
    },
    razorpay: {
      keyId: String,
      keySecret: String,
    },
    emailSettings: {
      host: String,
      port: Number,
      user: String,
      password: String,
      from: String,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: String,
      ogImage: String,
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String,
    },
    // Hero banner settings
    heroBanner: [{
      image: String,
      title: String,
      subtitle: String,
      buttonText: String,
      buttonLink: String,
      isActive: {
        type: Boolean,
        default: true,
      },
      order: Number,
    }],
    // Homepage section visibility
    homepageSections: {
      showCategories: { type: Boolean, default: true },
      showBestSellers: { type: Boolean, default: true },
      showCollections: { type: Boolean, default: true },
      showReviews: { type: Boolean, default: true },
      showInstagram: { type: Boolean, default: true },
      showBrandStory: { type: Boolean, default: true },
    },
    invoiceSettings: {
      prefix: {
        type: String,
        default: 'INV',
      },
      startingNumber: {
        type: Number,
        default: 1000,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
