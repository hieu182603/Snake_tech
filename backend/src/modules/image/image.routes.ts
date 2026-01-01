import { Router } from 'express';
import { ImageController } from './image.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public routes - get image URLs
router.get('/url/:publicId', ImageController.getImageUrl);

// Protected routes
router.post('/upload',
  authMiddleware,
  ImageController.getUploadMiddleware(),
  ImageController.uploadImage
);

router.post('/upload-multiple',
  authMiddleware,
  ImageController.getUploadMultipleMiddleware(),
  ImageController.uploadMultipleImages
);

router.delete('/:publicId',
  authMiddleware,
  ImageController.deleteImage
);

router.delete('/',
  authMiddleware,
  ImageController.deleteMultipleImages
);

export default router;
