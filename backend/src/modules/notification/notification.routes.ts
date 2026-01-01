import { Router } from 'express';
import { NotificationController } from './notification.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// Protected routes
router.get('/', authMiddleware, NotificationController.getUserNotifications);
router.put('/:id/read', authMiddleware, NotificationController.markAsRead);
router.put('/read-all', authMiddleware, NotificationController.markAllAsRead);

export default router;
