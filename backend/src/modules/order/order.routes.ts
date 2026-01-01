import { Router } from 'express';
import { OrderController } from './order.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { rbacMiddleware } from '../../middlewares/rbac.middleware';

const router = Router();

// Customer routes
router.post('/', authMiddleware, OrderController.createOrder);
router.get('/my-orders', authMiddleware, OrderController.getUserOrders);
router.get('/:id', authMiddleware, OrderController.getOrderById);
router.put('/:id/cancel', authMiddleware, OrderController.cancelOrder);

// Admin/Staff routes
router.get('/', authMiddleware, rbacMiddleware(['ADMIN', 'STAFF']), OrderController.getAllOrders);
router.put('/:id/status', authMiddleware, rbacMiddleware(['ADMIN', 'STAFF']), OrderController.updateOrderStatus);

export default router;
