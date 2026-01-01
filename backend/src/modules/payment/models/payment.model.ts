import mongoose, { Schema, Document } from 'mongoose';
import { PaymentMethod, PaymentProviderStatus } from '../../../constants/enums.js';

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentProviderStatus;
  providerTxnId?: string;
  rawPayload?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  method: {
    type: String,
    enum: Object.values(PaymentMethod),
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'VND'
  },
  status: {
    type: String,
    enum: Object.values(PaymentProviderStatus),
    default: PaymentProviderStatus.INIT
  },
  providerTxnId: {
    type: String
  },
  rawPayload: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ orderId: 1 }, { unique: true });
paymentSchema.index({ providerTxnId: 1 }, { unique: true, sparse: true });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
