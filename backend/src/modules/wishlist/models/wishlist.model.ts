import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlistItem {
  productId: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface IWishlist extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistItemSchema = new Schema<IWishlistItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const wishlistSchema = new Schema<IWishlist>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  items: [wishlistItemSchema]
}, {
  timestamps: true
});

// Indexes
wishlistSchema.index({ userId: 1 }, { unique: true });
wishlistSchema.index({ 'items.productId': 1 });

export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
