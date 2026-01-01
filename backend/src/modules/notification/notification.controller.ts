import { Request, Response } from 'express';
import { NotificationService } from './notification.service.js';

export class NotificationController {
    static async getUserNotifications(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const notifications = await NotificationService.getUserNotifications(userId);
            return res.status(200).json(notifications);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async markAsRead(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.userId;
            await NotificationService.markAsRead(id, userId);
            return res.status(200).json({ message: 'Marked as read' });
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async markAllAsRead(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            await NotificationService.markAllAsRead(userId);
            return res.status(200).json({ message: 'All marked as read' });
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
