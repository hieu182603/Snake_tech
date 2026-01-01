import { Router } from 'express';
import { ImageController } from './image.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Public routes
router.get('/:filename', ImageController.getImage);

// Protected routes
router.post('/upload', authMiddleware, upload.single('image'), ImageController.uploadImage);
router.delete('/:id', authMiddleware, ImageController.deleteImage);

export default router;
