import type { Notification, NotificationStats, CreateNotificationData } from '@/types/product';

export class NotificationService {
  private static instance: NotificationService;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async getNotifications(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: string;
      type?: string;
      priority?: string;
      isRead?: boolean;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<{ notifications: Notification[]; total: number; totalPages: number }> {
    try {
      // Mock data for now - replace with actual API call
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'ORDER_CREATED' as any,
          priority: 'HIGH' as any,
          status: 'UNREAD' as any,
          title: 'Đơn hàng mới #ORD-2024-001',
          message: 'Khách hàng Nguyễn Văn A vừa đặt đơn hàng trị giá 15,000,000đ',
          data: { orderId: '1' },
          recipientId: 'admin',
          isBroadcast: false,
          readAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'LOW_STOCK_ALERT' as any,
          priority: 'MEDIUM' as any,
          status: 'UNREAD' as any,
          title: 'Cảnh báo tồn kho thấp',
          message: 'Sản phẩm "Laptop Gaming XYZ" chỉ còn 5 sản phẩm trong kho',
          data: { productId: '1', stock: 5 },
          recipientId: 'admin',
          isBroadcast: false,
          readAt: null,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      return {
        notifications: mockNotifications,
        total: mockNotifications.length,
        totalPages: Math.ceil(mockNotifications.length / limit)
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async getNotificationStats(): Promise<NotificationStats> {
    try {
      // Mock data for now - replace with actual API call
      return {
        total: 24,
        unread: 8,
        read: 12,
        archived: 4,
        byPriority: {
          low: 10,
          medium: 8,
          high: 4,
          urgent: 2
        },
        byType: {
          ORDER_CREATED: 6,
          ORDER_STATUS_UPDATED: 4,
          PAYMENT_RECEIVED: 3,
          LOW_STOCK_ALERT: 5,
          NEW_CUSTOMER: 2,
          SHIPPER_ASSIGNED: 1,
          SYSTEM_ALERT: 2,
          FEEDBACK_RECEIVED: 1
        }
      };
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      // Mock data for now - replace with actual API call
      return 8;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Marking notification as read:', notificationId);
      return {
        id: notificationId,
        type: 'SYSTEM_ALERT' as any,
        priority: 'LOW' as any,
        status: 'READ' as any,
        title: 'Mock notification',
        message: 'Mock message',
        data: {},
        recipientId: 'admin',
        isBroadcast: false,
        readAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markMultipleAsRead(notificationIds: string[]): Promise<number> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Marking multiple notifications as read:', notificationIds);
      return notificationIds.length;
    } catch (error) {
      console.error('Error marking multiple notifications as read:', error);
      throw error;
    }
  }

  async archiveNotification(notificationId: string): Promise<Notification> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Archiving notification:', notificationId);
      return {
        id: notificationId,
        type: 'SYSTEM_ALERT' as any,
        priority: 'LOW' as any,
        status: 'ARCHIVED' as any,
        title: 'Mock notification',
        message: 'Mock message',
        data: {},
        recipientId: 'admin',
        isBroadcast: false,
        readAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error archiving notification:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Deleting notification:', notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  async createNotification(data: CreateNotificationData): Promise<Notification[]> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Creating notification:', data);
      return [{
        id: 'mock-id',
        type: data.type,
        priority: data.priority,
        status: 'UNREAD' as any,
        title: data.title,
        message: data.message,
        data: data.data || {},
        recipientId: data.recipientId || 'admin',
        isBroadcast: data.isBroadcast || false,
        readAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
}
