import { Cart } from './models/cart.model.js';
import { Product } from '../product/models/product.model.js';

export class CartService {
    /**
     * Get user's cart with populated product details
     */
    static async getUserCart(userId: string) {
        try {
            let cart = await Cart.findOne({ userId })
                .populate({
                    path: 'items.productId',
                    select: 'name price images stock isActive',
                    populate: [
                        { path: 'categoryId', select: 'name' },
                        { path: 'brandId', select: 'name' }
                    ]
                });

            if (!cart) {
                cart = await Cart.create({ userId, items: [] });
            }

            // Filter out inactive products and calculate totals
            const validItems = cart.items.filter(item => {
                const product = item.productId as any;
                return product && product.isActive && product.stock > 0;
            });

            // Recalculate totals
            let totalItems = 0;
            let totalPrice = 0;

            validItems.forEach(item => {
                const product = item.productId as any;
                const quantity = Math.min(item.quantity, product.stock); // Don't allow more than available stock
                totalItems += quantity;
                totalPrice += product.price * quantity;
            });

            return {
                userId: cart.userId,
                items: validItems,
                totalItems,
                totalPrice,
                updatedAt: cart.updatedAt
            };
        } catch (error) {
            console.error('Get user cart error:', error);
            throw error;
        }
    }

    /**
     * Add item to cart
     */
    static async addToCart(userId: string, { productId, quantity }: { productId: string; quantity: number }) {
        try {
            // Check if product exists and is active
            const product = await Product.findById(productId);
            if (!product || !product.isActive) {
                throw new Error('Product not found or inactive');
            }

            if (product.stock < quantity) {
                throw new Error(`Insufficient stock. Available: ${product.stock}`);
            }

            // Get or create cart
            let cart = await Cart.findOne({ userId });
            if (!cart) {
                cart = new Cart({ userId, items: [] });
            }

            // Check if item already exists in cart
            const existingItemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId
            );

            if (existingItemIndex > -1) {
                // Update existing item
                const newQuantity = cart.items[existingItemIndex].quantity + quantity;
                if (newQuantity > product.stock) {
                    throw new Error(`Cannot add ${quantity} more items. Total would exceed available stock (${product.stock})`);
                }
                cart.items[existingItemIndex].quantity = newQuantity;
            } else {
                // Add new item
                cart.items.push({
                    productId,
                    quantity,
                    price: product.price
                });
            }

            await cart.save();
            return await this.getUserCart(userId);
        } catch (error) {
            console.error('Add to cart error:', error);
            throw error;
        }
    }

    /**
     * Update cart item quantity
     */
    static async updateCartItem(userId: string, productId: string, quantity: number) {
        try {
            const cart = await Cart.findOne({ userId });
            if (!cart) {
                throw new Error('Cart not found');
            }

            const itemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId
            );

            if (itemIndex === -1) {
                throw new Error('Item not found in cart');
            }

            if (quantity === 0) {
                // Remove item if quantity is 0
                cart.items.splice(itemIndex, 1);
            } else {
                // Check stock availability
                const product = await Product.findById(productId);
                if (!product) {
                    throw new Error('Product not found');
                }

                if (quantity > product.stock) {
                    throw new Error(`Quantity exceeds available stock (${product.stock})`);
                }

                cart.items[itemIndex].quantity = quantity;
            }

            await cart.save();
            return await this.getUserCart(userId);
        } catch (error) {
            console.error('Update cart item error:', error);
            throw error;
        }
    }

    /**
     * Remove item from cart
     */
    static async removeFromCart(userId: string, productId: string) {
        try {
            const cart = await Cart.findOne({ userId });
            if (!cart) {
                throw new Error('Cart not found');
            }

            const itemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId
            );

            if (itemIndex === -1) {
                throw new Error('Item not found in cart');
            }

            cart.items.splice(itemIndex, 1);
            await cart.save();

            return await this.getUserCart(userId);
        } catch (error) {
            console.error('Remove from cart error:', error);
            throw error;
        }
    }

    /**
     * Clear entire cart
     */
    static async clearCart(userId: string) {
        try {
            const cart = await Cart.findOneAndUpdate(
                { userId },
                { items: [], updatedAt: new Date() },
                { new: true }
            );

            return await this.getUserCart(userId);
        } catch (error) {
            console.error('Clear cart error:', error);
            throw error;
        }
    }
}
