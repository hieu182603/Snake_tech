import { Router } from 'express';
import { BannerController } from './banner.controller.js';

const router = Router();

// Public routes
router.get('/', BannerController.getAllBanners);

// Protected routes (Admin only)
router.post('/', BannerController.createBanner);
router.put('/:id', BannerController.updateBanner);
router.delete('/:id', BannerController.deleteBanner);

export default router;
