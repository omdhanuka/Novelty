import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['flat', 'percentage'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    minCartValue: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
    },
    description: {
      type: String,
    },
    usageLimit: {
      type: Number,
      default: null, // null means unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTill: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }],
    firstOrderOnly: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    usedBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      usedAt: Date,
    }],
  },
  {
    timestamps: true,
  }
);

// Check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.isActive &&
    this.validFrom <= now &&
    this.validTill >= now &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  );
};

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
