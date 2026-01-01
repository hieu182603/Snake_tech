import mongoose, { Schema, Document } from 'mongoose';

export interface IShipperProfile extends Document {
  _id: mongoose.Types.ObjectId;
  accountId: mongoose.Types.ObjectId;
  vehicleType?: string;
  areas: string[];
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const shipperProfileSchema = new Schema<IShipperProfile>({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  vehicleType: {
    type: String
  },
  areas: [{
    type: String
  }],
  isOnline: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
shipperProfileSchema.index({ accountId: 1 }, { unique: true });

export const ShipperProfile = mongoose.model<IShipperProfile>('ShipperProfile', shipperProfileSchema);
