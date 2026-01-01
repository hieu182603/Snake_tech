import { Request, Response } from 'express';
import { CartService } from './cart.service';
import { z } from 'zod';

// Validation schemas
const addToCartSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
});

const updateCartItemSchema = z.object({
    quantity: z.number().min(0, 'Quantity cannot be negative'),
});

export class CartController {
    /**
     * Get user's cart
     */
    static async getUserCart(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const cart = await CartService.getUserCart(userId);
            return res.status(200).json(cart);
        } catch (error: any) {
            console.error('Get cart error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Add item to cart
     */
    static async addToCart(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;

            const parse = addToCartSchema.safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    message: 'Invalid data',
                    errors: parse.error.flatten()
                });
            }

            const cart = await CartService.addToCart(userId, parse.data);
            return res.status(200).json(cart);
        } catch (error: any) {
            if (error.message.includes('not found') || error.message.includes('stock')) {
                return res.status(400).json({ message: error.message });
            }
            console.error('Add to cart error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update cart item
     */
    static async updateCartItem(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const { productId } = req.params;

            const parse = updateCartItemSchema.safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    message: 'Invalid data',
                    errors: parse.error.flatten()
                });
            }

            const cart = await CartService.updateCartItem(userId, productId, parse.data.quantity);
            return res.status(200).json(cart);
        } catch (error: any) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ message: error.message });
            }
            console.error('Update cart item error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Remove item from cart
     */
    static async removeFromCart(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const { productId } = req.params;

            const cart = await CartService.removeFromCart(userId, productId);
            return res.status(200).json(cart);
        } catch (error: any) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ message: error.message });
            }
            console.error('Remove from cart error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Clear entire cart
     */
    static async clearCart(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const cart = await CartService.clearCart(userId);
            return res.status(200).json(cart);
        } catch (error: any) {
            console.error('Clear cart error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
