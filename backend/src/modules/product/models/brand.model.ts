import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  logoUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
brandSchema.index({ slug: 1 }, { unique: true });

export const Brand = mongoose.model<IBrand>('Brand', brandSchema);
