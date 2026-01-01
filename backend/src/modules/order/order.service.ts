import { Order } from './models/order.model.js';
import { emitToUser, emitToRole } from '../../config/socket.js';
import { NotificationService } from '../notification/notification.service.js';

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
                .populate('accountId', 'username email fullName')
                .sort({ createdAt: -1 })
                .select('-__v');

            return { orders };
        } catch (error) {
            console.error('Get all orders error:', error);
            throw error;
        }
    }

    /**
     * Update order status (Admin/Staff)
     */
    static async updateOrderStatus(orderId: string, status: string, updatedBy?: string) {
        try {
            const order = await Order.findByIdAndUpdate(
                orderId,
                { status, updatedAt: new Date() },
                { new: true }
            ).populate('accountId', 'fullName email username');

            if (!order) {
                throw new Error('Order not found');
            }

            // Emit real-time update via Socket.IO
            emitToUser(order.accountId.toString(), 'order_status_changed', {
                orderId: order._id,
                status: order.status,
                updatedAt: order.updatedAt,
                code: order.code
            });

            // Emit to admin/staff
            emitToRole('ADMIN', 'order_status_changed', {
                orderId: order._id,
                status: order.status,
                updatedAt: order.updatedAt,
                code: order.code,
                customerId: order.accountId._id,
                customerName: order.accountId.fullName,
                customerEmail: order.accountId.email
            });

            emitToRole('STAFF', 'order_status_changed', {
                orderId: order._id,
                status: order.status,
                updatedAt: order.updatedAt,
                code: order.code,
                customerId: order.accountId._id,
                customerName: order.accountId.fullName,
                customerEmail: order.accountId.email
            });

            // Create notification for customer
            const statusMessages = {
                'CONFIRMED': 'Đơn hàng của bạn đã được xác nhận',
                'PROCESSING': 'Đơn hàng của bạn đang được xử lý',
                'SHIPPED': 'Đơn hàng của bạn đã được giao cho shipper',
                'DELIVERED': 'Đơn hàng của bạn đã được giao thành công',
                'CANCELLED': 'Đơn hàng của bạn đã bị hủy',
                'RETURNED': 'Đơn hàng của bạn đã được trả lại'
            };

            const message = statusMessages[status as keyof typeof statusMessages] || `Trạng thái đơn hàng đã được cập nhật thành ${status}`;

            await NotificationService.createNotification(
                order.accountId._id.toString(),
                'Cập nhật đơn hàng',
                `Đơn hàng ${order.code}: ${message}`,
                'order',
                {
                    orderId: order._id,
                    status: order.status,
                    code: order.code
                }
            );

            return order;
        } catch (error) {
            console.error('Update order status error:', error);
            throw error;
        }
    }
}
