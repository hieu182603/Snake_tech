import mongoose, { Schema, Document } from 'mongoose';
import { ImageProvider, ImageOwnerType } from '../../../constants/enums.js';

export interface IImage extends Document {
  _id: mongoose.Types.ObjectId;
  url: string;
  publicId?: string;
  provider: ImageProvider;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  alt?: string;
  ownerType: ImageOwnerType;
  ownerId?: mongoose.Types.ObjectId;
  isPrimary: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IImage>({
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    sparse: true,
    unique: true
  },
  provider: {
    type: String,
    enum: Object.values(ImageProvider),
    default: ImageProvider.CLOUDINARY
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  format: {
    type: String
  },
  size: {
    type: Number
  },
  alt: {
    type: String
  },
  ownerType: {
    type: String,
    enum: Object.values(ImageOwnerType),
    required: true
  },
  ownerId: {
    type: Schema.Types.ObjectId
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes
imageSchema.index({ publicId: 1 }, { unique: true, sparse: true });
imageSchema.index({ ownerType: 1, ownerId: 1 });
imageSchema.index({ tags: 1 });
imageSchema.index({ createdAt: 1 });

export const Image = mongoose.model<IImage>('Image', imageSchema);
