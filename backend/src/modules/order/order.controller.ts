import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { z } from 'zod';

// Validation schemas
const createOrderSchema = z.object({
    items: z.array(z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
        price: z.number().positive('Price must be positive')
    })).min(1, 'Order must have at least one item'),
    shippingAddress: z.object({
        street: z.string().min(1, 'Street is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        zipCode: z.string().min(1, 'Zip code is required'),
        country: z.string().min(1, 'Country is required')
    }),
    paymentMethod: z.enum(['CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER'])
});

const updateOrderStatusSchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
});

export class OrderController {
    /**
     * Create new order
     */
    static async createOrder(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;

            const parse = createOrderSchema.safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    message: 'Invalid data',
                    errors: parse.error.flatten()
                });
            }

            const order = await OrderService.createOrder(userId, parse.data);
            return res.status(201).json(order);
        } catch (error: any) {
            if (error.message.includes('stock') || error.message.includes('not found')) {
                return res.status(400).json({ message: error.message });
            }
            console.error('Create order error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get user orders
     */
    static async getUserOrders(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const orders = await OrderService.getUserOrders(userId);
            return res.status(200).json(orders);
        } catch (error: any) {
            console.error('Get user orders error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get order by ID
     */
    static async getOrderById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.userId;

            const order = await OrderService.getOrderById(id, userId);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            return res.status(200).json(order);
        } catch (error: any) {
            if (error.message === 'Unauthorized') {
                return res.status(403).json({ message: error.message });
            }
            console.error('Get order error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Cancel order
     */
    static async cancelOrder(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.userId;

            const order = await OrderService.cancelOrder(id, userId);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            return res.status(200).json(order);
        } catch (error: any) {
            if (error.message.includes('cannot be cancelled')) {
                return res.status(400).json({ message: error.message });
            }
            console.error('Cancel order error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get all orders (Admin/Staff only)
     */
    static async getAllOrders(req: Request, res: Response) {
        try {
            const orders = await OrderService.getAllOrders();
            return res.status(200).json(orders);
        } catch (error: any) {
            console.error('Get all orders error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update order status (Admin/Staff only)
     */
    static async updateOrderStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const parse = updateOrderStatusSchema.safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    message: 'Invalid data',
                    errors: parse.error.flatten()
                });
            }

            const order = await OrderService.updateOrderStatus(id, parse.data.status);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            return res.status(200).json(order);
        } catch (error: any) {
            console.error('Update order status error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
