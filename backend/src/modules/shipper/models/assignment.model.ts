import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  shipperAccountId: mongoose.Types.ObjectId;
  assignedAt: Date;
  acceptedAt?: Date;
  deliveredAt?: Date;
  note?: string;
}

const assignmentSchema = new Schema<IAssignment>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  shipperAccountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  note: {
    type: String
  }
});

// Indexes
assignmentSchema.index({ orderId: 1 }, { unique: true });
assignmentSchema.index({ shipperAccountId: 1, assignedAt: 1 });

export const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema);
