import { Request, Response } from 'express';
import { WishlistService } from './wishlist.service';
import { z } from 'zod';

// Validation schemas
const addToWishlistSchema = z.object({
    productId: z.string().min(1, 'Product ID is required')
});

export class WishlistController {
    /**
     * Get user's wishlist
     */
    static async getWishlist(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const wishlist = await WishlistService.getUserWishlist(userId);
            return res.status(200).json(wishlist);
        } catch (error: any) {
            console.error('Get wishlist error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Add product to wishlist
     */
    static async addToWishlist(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;

            const parse = addToWishlistSchema.safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    message: 'Invalid data',
                    errors: parse.error.flatten()
                });
            }

            const wishlist = await WishlistService.addToWishlist(userId, parse.data.productId);
            return res.status(200).json(wishlist);
        } catch (error: any) {
            if (error.message.includes('not found') || error.message.includes('already')) {
                return res.status(400).json({ message: error.message });
            }
            console.error('Add to wishlist error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Remove product from wishlist
     */
    static async removeFromWishlist(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const { productId } = req.params;

            const wishlist = await WishlistService.removeFromWishlist(userId, productId);
            return res.status(200).json(wishlist);
        } catch (error: any) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ message: error.message });
            }
            console.error('Remove from wishlist error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
