import { Router } from 'express';
import { CartController } from './cart.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// All cart routes require authentication
router.use(authMiddleware);

router.get('/', CartController.getUserCart);
router.post('/items', CartController.addToCart);
router.put('/items/:productId', CartController.updateCartItem);
router.delete('/items/:productId', CartController.removeFromCart);
router.delete('/', CartController.clearCart);

export default router;
