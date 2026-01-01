import { Request, Response } from 'express';
import { RFQService } from './rfq.service';
import { RFQType } from '../../constants/enums.js';
import { z } from 'zod';

// Validation schemas
const createRFQSchema = z.object({
    items: z.array(z.object({
        productId: z.string().optional(),
        productName: z.string().optional(),
        specs: z.record(z.any()).optional(),
        qty: z.number().min(1, 'Quantity must be at least 1')
    })).min(1, 'At least one item is required'),
    customer: z.object({
        name: z.string().min(1, 'Customer name is required'),
        email: z.string().email('Invalid email format').optional(),
        phone: z.string().min(1, 'Customer phone is required')
    }),
    type: z.enum([RFQType.CUSTOM_PC, RFQType.BULK_ORDER, RFQType.SPECIAL_PRODUCT]).optional(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    expectedBudget: z.number().optional(),
    total: z.number().min(0, 'Total must be non-negative')
});

export class RFQController {
    /**
     * Create a new RFQ
     */
    static async createRFQ(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;

            const parse = createRFQSchema.safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    message: 'Invalid data',
                    errors: parse.error.flatten()
                });
            }

            const rfqData = {
                ...parse.data,
                accountId: userId
            };

            const rfq = await RFQService.createRFQ(rfqData);
            return res.status(201).json({
                success: true,
                rfqId: rfq._id,
                message: 'RFQ created successfully'
            });
        } catch (error: any) {
            console.error('Create RFQ error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get user's RFQs
     */
    static async getMyRFQs(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const { page = 1, limit = 10 } = req.query;

            const rfqs = await RFQService.getRFQsByUserId(userId, {
                page: parseInt(page as string),
                limit: parseInt(limit as string)
            });

            return res.status(200).json(rfqs);
        } catch (error: any) {
            console.error('Get my RFQs error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get RFQ by ID (owner or admin only)
     */
    static async getRFQById(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const userRole = (req as any).user.role;
            const { id } = req.params;

            const rfq = await RFQService.getRFQById(id, userId, userRole);
            if (!rfq) {
                return res.status(404).json({ message: 'RFQ not found' });
            }

            return res.status(200).json(rfq);
        } catch (error: any) {
            console.error('Get RFQ by ID error:', error);
            if (error.message === 'Access denied') {
                return res.status(403).json({ message: 'Access denied' });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
