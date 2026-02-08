import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
  },
  buttonLink: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const bannerSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['promotional', 'informational', 'alert'],
    default: 'promotional',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  icon: {
    type: String,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  backgroundColor: {
    type: String,
    default: '#f3f4f6',
  },
  textColor: {
    type: String,
    default: '#111827',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const brandStorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  highlights: [{
    icon: String,
    title: String,
    description: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
});

const testimonialSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerImage: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  review: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const featureSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const sectionVisibilitySchema = new mongoose.Schema({
  heroSlider: {
    type: Boolean,
    default: true,
  },
  promotionalBanners: {
    type: Boolean,
    default: true,
  },
  shopByCategory: {
    type: Boolean,
    default: true,
  },
  bestSellers: {
    type: Boolean,
    default: true,
  },
  brandStory: {
    type: Boolean,
    default: true,
  },
  specialCollections: {
    type: Boolean,
    default: true,
  },
  whyChooseUs: {
    type: Boolean,
    default: true,
  },
  customerReviews: {
    type: Boolean,
    default: true,
  },
  instagramProof: {
    type: Boolean,
    default: false,
  },
});

const homeContentSchema = new mongoose.Schema(
  {
    heroSlides: [heroSlideSchema],
    banners: [bannerSchema],
    brandStory: brandStorySchema,
    testimonials: [testimonialSchema],
    features: [featureSchema],
    sectionVisibility: {
      type: sectionVisibilitySchema,
      default: () => ({}),
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one document exists (singleton pattern)
homeContentSchema.statics.getInstance = async function () {
  let content = await this.findOne();
  if (!content) {
    content = await this.create({
      heroSlides: [],
      banners: [],
      testimonials: [],
      features: [],
    });
  }
  return content;
};

const HomeContent = mongoose.model('HomeContent', homeContentSchema);

export default HomeContent;
