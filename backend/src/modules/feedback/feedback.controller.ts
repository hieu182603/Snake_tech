import { Request, Response } from 'express';
import { FeedbackService } from './feedback.service.js';

export class FeedbackController {
    /**
     * Get product feedback
     */
    static async getProductFeedback(req: Request, res: Response) {
        try {
            const { productId } = req.params;
            const feedback = await FeedbackService.getProductFeedback(productId);
            return res.status(200).json(feedback);
        } catch (error: any) {
            console.error('Get product feedback error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Create feedback
     */
    static async createFeedback(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const feedback = await FeedbackService.createFeedback(userId, req.body);
            return res.status(201).json(feedback);
        } catch (error: any) {
            console.error('Create feedback error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update feedback
     */
    static async updateFeedback(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.userId;
            const feedback = await FeedbackService.updateFeedback(id, userId, req.body);
            if (!feedback) {
                return res.status(404).json({ message: 'Feedback not found' });
            }
            return res.status(200).json(feedback);
        } catch (error: any) {
            console.error('Update feedback error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Delete feedback
     */
    static async deleteFeedback(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.userId;
            const result = await FeedbackService.deleteFeedback(id, userId);
            if (!result) {
                return res.status(404).json({ message: 'Feedback not found' });
            }
            return res.status(200).json({ message: 'Feedback deleted successfully' });
        } catch (error: any) {
            console.error('Delete feedback error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get all feedback (Admin/Staff)
     */
    static async getAllFeedback(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, search, status } = req.query;
            const feedback = await FeedbackService.getAllFeedback(
                Number(page),
                Number(limit),
                search as string,
                status as string
            );
            return res.status(200).json(feedback);
        } catch (error: any) {
            console.error('Get all feedback error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
