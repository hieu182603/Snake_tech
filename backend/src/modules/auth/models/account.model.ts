import mongoose, { Schema, Document } from 'mongoose';
import { AccountRole } from '../../../constants/enums.js';

export interface IAccount extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string;
  role: AccountRole;
  avatarUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: Object.values(AccountRole),
    default: AccountRole.CUSTOMER
  },
  avatarUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
accountSchema.index({ email: 1 }, { unique: true });
accountSchema.index({ phone: 1 });

export const Account = mongoose.model<IAccount>('Account', accountSchema);
