import { Router } from 'express';
import { ShipperController } from './shipper.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';

const router = Router();

// Shipper routes
router.post('/register', ShipperController.registerShipper);
router.post('/login', ShipperController.loginShipper);
router.put('/profile', authMiddleware, rbacMiddleware(['SHIPPER']), ShipperController.updateProfile);

// Assignment routes (Admin/Staff)
router.get('/assignments', authMiddleware, rbacMiddleware(['ADMIN', 'STAFF', 'SHIPPER']), ShipperController.getAssignments);
router.put('/assignments/:id/status', authMiddleware, rbacMiddleware(['SHIPPER']), ShipperController.updateAssignmentStatus);

export default router;
