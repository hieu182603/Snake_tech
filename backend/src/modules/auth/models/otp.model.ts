import mongoose, { Schema, Document } from 'mongoose';
import { OtpPurpose } from '../../../constants/enums.js';

export interface IOtp extends Document {
  _id: mongoose.Types.ObjectId;
  target: string;
  purpose: OtpPurpose;
  otpHash: string;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
  target: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: Object.values(OtpPurpose),
    required: true
  },
  otpHash: {
    type: String,
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
otpSchema.index({ target: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = mongoose.model<IOtp>('Otp', otpSchema);
