import mongoose, { Schema, Document } from 'mongoose';

export interface IDeviceInfo {
  ip?: string;
  ua?: string;
  deviceName?: string;
}

export interface IRefreshToken extends Document {
  _id: mongoose.Types.ObjectId;
  accountId: mongoose.Types.ObjectId;
  tokenHash: string;
  deviceInfo?: IDeviceInfo;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
}

const deviceInfoSchema = new Schema<IDeviceInfo>({
  ip: { type: String },
  ua: { type: String },
  deviceName: { type: String }
}, { _id: false });

const refreshTokenSchema = new Schema<IRefreshToken>({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  tokenHash: {
    type: String,
    required: true
  },
  deviceInfo: deviceInfoSchema,
  expiresAt: {
    type: Date,
    required: true
  },
  revokedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
refreshTokenSchema.index({ accountId: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
