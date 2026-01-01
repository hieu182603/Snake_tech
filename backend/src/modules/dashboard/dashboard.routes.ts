import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// All dashboard routes require authentication
router.use(authMiddleware);

router.get('/stats', DashboardController.getDashboardStats);

export default router;
