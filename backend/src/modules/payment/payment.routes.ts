import { Router } from 'express';
import { PaymentController } from './payment.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// Protected routes
router.post('/create-payment-intent', authMiddleware, PaymentController.createPaymentIntent);
router.post('/confirm-payment', authMiddleware, PaymentController.confirmPayment);
router.get('/payment-history', authMiddleware, PaymentController.getPaymentHistory);

// Webhook (no auth required)
router.post('/webhook', PaymentController.handleWebhook);

export default router;
