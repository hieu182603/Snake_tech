import { Router } from 'express';
import { WishlistController } from './wishlist.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// All wishlist routes require authentication
router.use(authMiddleware);

router.get('/', WishlistController.getWishlist);
router.post('/', WishlistController.addToWishlist);
router.delete('/:productId', WishlistController.removeFromWishlist);

export default router;
