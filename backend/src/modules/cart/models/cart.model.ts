import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  qty: number;
  priceSnapshot?: number;
}

export interface ICart extends Document {
  _id: mongoose.Types.ObjectId;
  accountId: mongoose.Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  qty: {
    type: Number,
    required: true,
    min: 1
  },
  priceSnapshot: {
    type: Number,
    min: 0
  }
}, { _id: false });

const cartSchema = new Schema<ICart>({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    unique: true
  },
  items: [cartItemSchema]
}, {
  timestamps: { createdAt: false, updatedAt: true }
});

// Indexes
cartSchema.index({ accountId: 1 }, { unique: true });
cartSchema.index({ 'items.productId': 1 });

export const Cart = mongoose.model<ICart>('Cart', cartSchema);
