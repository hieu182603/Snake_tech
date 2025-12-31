import mongoose, { Schema, Document } from 'mongoose';
import { ReviewStatus } from '../../../constants/enums.js';

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  accountId: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  content: string;
  images: string[];
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: Object.values(ReviewStatus),
    default: ReviewStatus.PENDING
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ productId: 1, createdAt: 1 });
reviewSchema.index({ accountId: 1, createdAt: 1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
