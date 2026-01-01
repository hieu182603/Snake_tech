import mongoose, { Schema, Document } from 'mongoose';

export interface IProductImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  categoryId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  price: number;
  salePrice?: number;
  stock: number;
  sku?: string;
  images: IProductImage[];
  specs: Record<string, any>;
  tags: string[];
  ratingAvg: number;
  ratingCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productImageSchema = new Schema<IProductImage>({
  url: { type: String, required: true },
  publicId: { type: String },
  alt: { type: String }
}, { _id: false });

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  salePrice: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  sku: {
    type: String
  },
  images: [productImageSchema],
  specs: {
    type: Schema.Types.Mixed
  },
  tags: [{
    type: String
  }],
  ratingAvg: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ categoryId: 1 });
productSchema.index({ brandId: 1 });
productSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
