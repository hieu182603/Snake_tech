import { emitToUser, emitToRole } from '../../config/socket.js';
import { Notification } from './models/notification.model.js';

export class NotificationService {
    static async getUserNotifications(userId: string) {
        try {
            const notifications = await Notification.find({ userId })
                .sort({ createdAt: -1 })
                .limit(50);

            return { notifications };
        } catch (error) {
            console.error('Get user notifications error:', error);
            return { notifications: [] };
        }
    }

    static async createNotification(
        userId: string,
        title: string,
        message: string,
        type: string = 'info',
        data?: any
    ) {
        try {
            const notification = new Notification({
                userId,
                title,
                message,
                type,
                data,
                isRead: false,
            });

            await notification.save();

            // Emit real-time notification via Socket.IO
            emitToUser(userId, 'notification', {
                id: notification._id,
                title,
                message,
                type,
                data,
                createdAt: notification.createdAt,
            });

            return notification;
        } catch (error) {
            console.error('Create notification error:', error);
            throw error;
        }
    }

    static async createBroadcastNotification(
        title: string,
        message: string,
        type: string = 'info',
        targetRole?: string,
        data?: any
    ) {
        try {
            // For broadcast notifications, we don't store them in DB
            // Just emit via Socket.IO
            const notificationData = {
                id: `broadcast_${Date.now()}`,
                title,
                message,
                type,
                data,
                createdAt: new Date(),
                isBroadcast: true,
            };

            if (targetRole) {
                emitToRole(targetRole, 'notification', notificationData);
            } else {
                // Broadcast to all connected users
                // Note: In production, you might want to be more selective
                emitToRole('ADMIN', 'notification', notificationData);
                emitToRole('STAFF', 'notification', notificationData);
                emitToRole('CUSTOMER', 'notification', notificationData);
            }

            return notificationData;
        } catch (error) {
            console.error('Create broadcast notification error:', error);
            throw error;
        }
    }

    static async markAsRead(notificationId: string, userId: string) {
        try {
            await Notification.findOneAndUpdate(
                { _id: notificationId, userId },
                { isRead: true, readAt: new Date() }
            );
            return true;
        } catch (error) {
            console.error('Mark as read error:', error);
            return false;
        }
    }

    static async markAllAsRead(userId: string) {
        try {
            await Notification.updateMany(
                { userId, isRead: false },
                { isRead: true, readAt: new Date() }
            );
            return true;
        } catch (error) {
            console.error('Mark all as read error:', error);
            return false;
        }
    }

    static async getUnreadCount(userId: string): Promise<number> {
        try {
            const count = await Notification.countDocuments({ userId, isRead: false });
            return count;
        } catch (error) {
            console.error('Get unread count error:', error);
            return 0;
        }
    }
}
