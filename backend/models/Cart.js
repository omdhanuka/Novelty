import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  selectedColor: {
    type: String,
    default: '',
  },
  selectedSize: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
  },
  // Snapshot of product details at time of adding (prevent price changes)
  productSnapshot: {
    name: String,
    image: String,
    price: Number,
    originalPrice: Number,
    discount: Number,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update the updatedAt field before saving
cartSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Methods
cartSchema.methods.getTotalPrice = function () {
  return this.items.reduce((total, item) => {
    const price = item.price || item.productSnapshot?.price || 0;
    return total + price * item.quantity;
  }, 0);
};

cartSchema.methods.getTotalItems = function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};

cartSchema.methods.getTotalDiscount = function () {
  return this.items.reduce((total, item) => {
    const discount = item.productSnapshot?.discount || 0;
    const originalPrice = item.productSnapshot?.originalPrice || item.productSnapshot?.price || 0;
    const discountAmount = (originalPrice * discount) / 100;
    return total + discountAmount * item.quantity;
  }, 0);
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
