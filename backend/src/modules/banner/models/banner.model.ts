import mongoose, { Schema, Document } from 'mongoose';
import { BannerPosition } from '../../../constants/enums.js';

export interface IBanner extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  position: BannerPosition;
  startAt?: Date;
  endAt?: Date;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  linkUrl: {
    type: String
  },
  position: {
    type: String,
    enum: Object.values(BannerPosition),
    required: true
  },
  startAt: {
    type: Date
  },
  endAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
bannerSchema.index({ position: 1, isActive: 1, sortOrder: 1 });

export const Banner = mongoose.model<IBanner>('Banner', bannerSchema);
