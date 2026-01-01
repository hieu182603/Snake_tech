import mongoose, { Schema, Document } from 'mongoose';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../../../constants/enums.js';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  nameSnapshot: string;
  priceSnapshot: number;
  qty: number;
  imageSnapshot?: string;
}

export interface IOrderTotals {
  subtotal: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
}

export interface IShippingAddress {
  receiverName: string;
  phone: string;
  addressLine: string;
  ward: string;
  district: string;
  province: string;
  note?: string;
}

export interface IOrderTimeline {
  status: string;
  at: Date;
  byAccountId?: mongoose.Types.ObjectId;
  note?: string;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  accountId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totals: IOrderTotals;
  shippingAddress: IShippingAddress;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shipperAccountId?: mongoose.Types.ObjectId;
  timeline: IOrderTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  nameSnapshot: {
    type: String,
    required: true
  },
  priceSnapshot: {
    type: Number,
    required: true,
    min: 0
  },
  qty: {
    type: Number,
    required: true,
    min: 1
  },
  imageSnapshot: {
    type: String
  }
}, { _id: false });

const orderTotalsSchema = new Schema<IOrderTotals>({
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingFee: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const shippingAddressSchema = new Schema<IShippingAddress>({
  receiverName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  addressLine: {
    type: String,
    required: true
  },
  ward: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  note: {
    type: String
  }
}, { _id: false });

const orderTimelineSchema = new Schema<IOrderTimeline>({
  status: {
    type: String,
    required: true
  },
  at: {
    type: Date,
    required: true,
    default: Date.now
  },
  byAccountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  note: {
    type: String
  }
}, { _id: false });

const orderSchema = new Schema<IOrder>({
  code: {
    type: String,
    required: true
  },
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  items: [orderItemSchema],
  totals: {
    type: orderTotalsSchema,
    required: true
  },
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING
  },
  paymentMethod: {
    type: String,
    enum: Object.values(PaymentMethod),
    default: PaymentMethod.COD
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.UNPAID
  },
  shipperAccountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  timeline: [orderTimelineSchema]
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ code: 1 }, { unique: true });
orderSchema.index({ accountId: 1, createdAt: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ shipperAccountId: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
