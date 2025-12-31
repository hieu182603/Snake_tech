import mongoose, { Schema, Document } from 'mongoose';
import { NotificationType } from '../../../constants/enums.js';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  accountId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  type: {
    type: String,
    enum: Object.values(NotificationType),
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  data: {
    type: Schema.Types.Mixed
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
notificationSchema.index({ accountId: 1, createdAt: 1 });
notificationSchema.index({ accountId: 1, isRead: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
