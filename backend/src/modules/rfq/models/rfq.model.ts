import mongoose, { Schema, Document } from 'mongoose';
import { RFQType, RFQStatus } from '../../../constants/enums.js';

export interface IRFQItem {
  productId?: mongoose.Types.ObjectId;
  productName?: string;
  specs?: Record<string, any>;
  qty: number;
}

export interface IRFQQuotation {
  totalPrice: number;
  note: string;
  quotedBy: mongoose.Types.ObjectId;
  quotedAt: Date;
}

export interface IRFQ extends Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  accountId: mongoose.Types.ObjectId;
  type: RFQType;
  title: string;
  description: string;
  items: IRFQItem[];
  attachments: mongoose.Types.ObjectId[];
  expectedBudget?: number;
  status: RFQStatus;
  quotation?: IRFQQuotation;
  relatedOrderId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const rfqItemSchema = new Schema<IRFQItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: {
    type: String
  },
  specs: {
    type: Schema.Types.Mixed
  },
  qty: {
    type: Number,
    default: 1
  }
}, { _id: false });

const rfqQuotationSchema = new Schema<IRFQQuotation>({
  totalPrice: {
    type: Number,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  quotedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  quotedAt: {
    type: Date,
    required: true
  }
}, { _id: false });

const rfqSchema = new Schema<IRFQ>({
  code: {
    type: String,
    required: true,
    unique: true
  },
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  type: {
    type: String,
    enum: Object.values(RFQType),
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  items: [rfqItemSchema],
  attachments: [{
    type: Schema.Types.ObjectId,
    ref: 'Image'
  }],
  expectedBudget: {
    type: Number
  },
  status: {
    type: String,
    enum: Object.values(RFQStatus),
    default: RFQStatus.SUBMITTED
  },
  quotation: rfqQuotationSchema,
  relatedOrderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }
}, {
  timestamps: true
});

// Indexes
rfqSchema.index({ code: 1 }, { unique: true });
rfqSchema.index({ accountId: 1, createdAt: 1 });
rfqSchema.index({ status: 1 });
rfqSchema.index({ relatedOrderId: 1 });

export const RFQ = mongoose.model<IRFQ>('RFQ', rfqSchema);
