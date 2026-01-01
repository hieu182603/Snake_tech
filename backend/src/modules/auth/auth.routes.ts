import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/verify-register', AuthController.verifyRegister);
router.post('/resend-otp', AuthController.resendOTP);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

// Protected routes
router.get('/me', authMiddleware, AuthController.getCurrentAccount);
router.put('/me', authMiddleware, AuthController.updateAccount);
router.post('/change-password', authMiddleware, AuthController.changePassword);

export default router;



