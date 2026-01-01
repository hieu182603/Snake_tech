import { Router } from 'express';
import { AnalyticsController } from './analytics.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';

const router = Router();
const analyticsController = new AnalyticsController();

// All analytics routes require authentication and admin/staff role
router.use(authMiddleware);
router.use(rbacMiddleware(['ADMIN', 'STAFF']));

router.get('/overview', analyticsController.getOverview.bind(analyticsController));
router.get('/sales', analyticsController.getSalesAnalytics.bind(analyticsController));
router.get('/products', analyticsController.getProductAnalytics.bind(analyticsController));
router.get('/customers', analyticsController.getCustomerAnalytics.bind(analyticsController));
router.get('/revenue-chart', analyticsController.getRevenueChart.bind(analyticsController));

export default router;
