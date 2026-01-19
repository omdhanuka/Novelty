import mongoose from 'mongoose';

const inventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    action: {
      type: String,
      enum: ['add', 'reduce', 'set'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const InventoryLog = mongoose.model('InventoryLog', inventoryLogSchema);

export default InventoryLog;
