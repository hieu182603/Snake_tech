import { Order } from '../order/models/order.model.js';
import { RFQ } from '../rfq/models/rfq.model.js';
import { Wishlist } from '../wishlist/models/wishlist.model.js';
import { Notification } from '../notification/models/notification.model.js';

export class DashboardService {
    /**
     * Get dashboard statistics for a user
     */
    static async getUserDashboardStats(userId: string) {
        try {
            // Get counts in parallel for better performance
            const [
                ordersCount,
                wishlistCount,
                rfqCount,
                notificationsCount
            ] = await Promise.all([
                // Count user's orders
                Order.countDocuments({ accountId: userId }),

                // Count user's wishlist items
                this.getUserWishlistCount(userId),

                // Count user's RFQs
                RFQ.countDocuments({ accountId: userId }),

                // Count user's unread notifications
                Notification.countDocuments({
                    recipientId: userId,
                    isRead: false
                })
            ]);

            return {
                ordersCount,
                wishlistCount,
                rfqCount,
                notificationsCount
            };
        } catch (error) {
            console.error('Get user dashboard stats error:', error);
            throw error;
        }
    }

    /**
     * Get count of items in user's wishlist
     */
    private static async getUserWishlistCount(userId: string): Promise<number> {
        try {
            const wishlist = await Wishlist.findOne({ userId }).select('items');
            if (!wishlist) {
                return 0;
            }

            // Filter out invalid items (could add more validation here if needed)
            return wishlist.items.length;
        } catch (error) {
            console.error('Get user wishlist count error:', error);
            return 0; // Return 0 on error rather than failing the whole request
        }
    }
}
