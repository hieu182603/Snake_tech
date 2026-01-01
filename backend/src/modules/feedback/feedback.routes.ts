import { Router } from 'express';
import { FeedbackController } from './feedback.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/products/:productId', FeedbackController.getProductFeedback);

// Protected routes
router.post('/', authMiddleware, FeedbackController.createFeedback);
router.put('/:id', authMiddleware, FeedbackController.updateFeedback);
router.delete('/:id', authMiddleware, FeedbackController.deleteFeedback);

export default router;
