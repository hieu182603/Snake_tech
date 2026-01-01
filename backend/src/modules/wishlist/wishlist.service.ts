import { Wishlist } from './models/wishlist.model.js';
import { Product } from '../product/models/product.model.js';
import mongoose from 'mongoose';

export class WishlistService {
    /**
     * Get user's wishlist with populated product details
     */
    static async getUserWishlist(userId: string) {
        try {
            let wishlist = await Wishlist.findOne({ userId })
                .populate({
                    path: 'items.productId',
                    select: 'name price images categoryId brandId isActive stock',
                    populate: [
                        { path: 'categoryId', select: 'name' },
                        { path: 'brandId', select: 'name' }
                    ]
                });

            if (!wishlist) {
                wishlist = await Wishlist.create({ userId, items: [] });
            }

            // Filter out inactive products and format response
            const validItems = wishlist.items
                .filter(item => {
                    const product = item.productId as any;
                    return product && product.isActive && product.stock > 0;
                })
                .map(item => ({
                    productId: item.productId,
                    addedAt: item.addedAt
                }));

            return {
                userId: wishlist.userId,
                items: validItems,
                totalItems: validItems.length
            };
        } catch (error) {
            console.error('Get user wishlist error:', error);
            throw error;
        }
    }

    /**
     * Add product to wishlist
     */
    static async addToWishlist(userId: string, productId: string) {
        try {
            // Check if product exists and is active
            const product = await Product.findById(productId);
            if (!product || !product.isActive) {
                throw new Error('Product not found or inactive');
            }

            // Get or create wishlist
            let wishlist = await Wishlist.findOne({ userId });
            if (!wishlist) {
                wishlist = new Wishlist({ userId, items: [] });
            }

            // Check if product already exists in wishlist
            const existingItemIndex = wishlist.items.findIndex(
                item => item.productId.toString() === productId
            );

            if (existingItemIndex > -1) {
                throw new Error('Product already in wishlist');
            }

            // Add new item
            wishlist.items.push({
                productId: new mongoose.Types.ObjectId(productId),
                addedAt: new Date()
            });

            await wishlist.save();
            return await this.getUserWishlist(userId);
        } catch (error) {
            console.error('Add to wishlist error:', error);
            throw error;
        }
    }

    /**
     * Remove product from wishlist
     */
    static async removeFromWishlist(userId: string, productId: string) {
        try {
            const wishlist = await Wishlist.findOne({ userId });
            if (!wishlist) {
                throw new Error('Wishlist not found');
            }

            const itemIndex = wishlist.items.findIndex(
                item => item.productId.toString() === productId
            );

            if (itemIndex === -1) {
                throw new Error('Product not found in wishlist');
            }

            wishlist.items.splice(itemIndex, 1);
            await wishlist.save();

            return await this.getUserWishlist(userId);
        } catch (error) {
            console.error('Remove from wishlist error:', error);
            throw error;
        }
    }
}
