import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';

const router = Router();
const adminController = new AdminController();

// All admin routes require authentication and admin role only
router.use(authMiddleware);
router.use(rbacMiddleware(['ADMIN']));

// Customer management routes
router.get('/customers', adminController.getCustomers.bind(adminController));
router.get('/customers/:id', adminController.getCustomerById.bind(adminController));
router.put('/customers/:id', adminController.updateCustomer.bind(adminController));
router.post('/customers/:id/ban', adminController.banCustomer.bind(adminController));
router.post('/customers/:id/unban', adminController.unbanCustomer.bind(adminController));

// Account management routes (Admin/Staff accounts)
router.get('/accounts', adminController.getAccounts.bind(adminController));
router.post('/accounts', adminController.createAccount.bind(adminController));
router.get('/accounts/:id', adminController.getAccountById.bind(adminController));
router.put('/accounts/:id', adminController.updateAccount.bind(adminController));
router.delete('/accounts/:id', adminController.deleteAccount.bind(adminController));
router.put('/accounts/:id/role', adminController.changeAccountRole.bind(adminController));
router.put('/accounts/:id/status', adminController.toggleAccountStatus.bind(adminController));

export default router;
