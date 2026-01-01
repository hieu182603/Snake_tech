import { Order } from './models/order.model.js';

export class OrderService {
    /**
     * Create new order
     */
    static async createOrder(userId: string, orderData: any) {
        try {
            const order = await Order.create({
                userId,
                ...orderData,
                status: 'PENDING'
            });

            return order;
        } catch (error) {
            console.error('Create order error:', error);
            throw error;
        }
    }

    /**
     * Get user orders
     */
    static async getUserOrders(userId: string) {
        try {
            const orders = await Order.find({ userId })
                .sort({ createdAt: -1 })
                .select('-__v');

            return orders;
        } catch (error) {
            console.error('Get user orders error:', error);
            throw error;
        }
    }

    /**
     * Get order by ID
     */
    static async getOrderById(orderId: string, userId: string) {
        try {
            const order = await Order.findOne({ _id: orderId, userId });
            return order;
        } catch (error) {
            console.error('Get order by ID error:', error);
            throw error;
        }
    }

    /**
     * Cancel order
     */
    static async cancelOrder(orderId: string, userId: string) {
        try {
            const order = await Order.findOneAndUpdate(
                { _id: orderId, userId, status: { $in: ['PENDING', 'CONFIRMED'] } },
                { status: 'CANCELLED', cancelledAt: new Date() },
                { new: true }
            );

            return order;
        } catch (error) {
            console.error('Cancel order error:', error);
            throw error;
        }
    }

    /**
     * Get all orders (Admin/Staff)
     */
    static async getAllOrders() {
        try {
            const orders = await Order.find({})
                .populate('userId', 'username email fullName')
                .sort({ createdAt: -1 })
                .select('-__v');

            return orders;
        } catch (error) {
            console.error('Get all orders error:', error);
            throw error;
        }
    }

    /**
     * Update order status (Admin/Staff)
     */
    static async updateOrderStatus(orderId: string, status: string) {
        try {
            const order = await Order.findByIdAndUpdate(
                orderId,
                { status, updatedAt: new Date() },
                { new: true }
            );

            return order;
        } catch (error) {
            console.error('Update order status error:', error);
            throw error;
        }
    }
}
