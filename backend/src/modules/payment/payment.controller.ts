import { Request, Response } from 'express';
import { PaymentService } from './payment.service.js';

export class PaymentController {
    /**
     * Create payment intent
     */
    static async createPaymentIntent(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const { amount, currency = 'USD' } = req.body;

            const paymentIntent = await PaymentService.createPaymentIntent(userId, amount, currency);
            return res.status(200).json(paymentIntent);
        } catch (error: any) {
            console.error('Create payment intent error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Confirm payment
     */
    static async confirmPayment(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const { paymentIntentId } = req.body;

            const payment = await PaymentService.confirmPayment(userId, paymentIntentId);
            return res.status(200).json(payment);
        } catch (error: any) {
            console.error('Confirm payment error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get payment history
     */
    static async getPaymentHistory(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const payments = await PaymentService.getPaymentHistory(userId);
            return res.status(200).json(payments);
        } catch (error: any) {
            console.error('Get payment history error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handle webhook
     */
    static async handleWebhook(req: Request, res: Response) {
        try {
            const event = req.body;
            await PaymentService.handleWebhook(event);
            return res.status(200).json({ received: true });
        } catch (error: any) {
            console.error('Webhook error:', error);
            return res.status(400).json({ message: 'Webhook error' });
        }
    }
}
