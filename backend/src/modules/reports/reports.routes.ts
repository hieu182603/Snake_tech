import { Router } from 'express';
import { ReportsController } from './reports.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';

const router = Router();
const reportsController = new ReportsController();

// All reports routes require authentication and admin/staff role
router.use(authMiddleware);
router.use(rbacMiddleware(['ADMIN', 'STAFF']));

router.get('/sales', reportsController.getSalesReport.bind(reportsController));
router.get('/orders', reportsController.getOrdersReport.bind(reportsController));
router.get('/products', reportsController.getProductsReport.bind(reportsController));
router.get('/customers', reportsController.getCustomersReport.bind(reportsController));
router.get('/export', reportsController.exportReport.bind(reportsController));

export default router;
