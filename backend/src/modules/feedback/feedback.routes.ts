import { Router } from 'express';
import { FeedbackController } from './feedback.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';

const router = Router();

// Public routes
router.get('/products/:productId', FeedbackController.getProductFeedback);

// Protected routes
router.post('/', authMiddleware, FeedbackController.createFeedback);
router.put('/:id', authMiddleware, FeedbackController.updateFeedback);
router.delete('/:id', authMiddleware, FeedbackController.deleteFeedback);

// Admin routes
router.get('/', authMiddleware, rbacMiddleware(['ADMIN', 'STAFF']), FeedbackController.getAllFeedback);

export default router;
