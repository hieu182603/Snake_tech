import { Router } from 'express';
import { ProductController } from './product.controller.js';

const router = Router();

// Public routes
router.get('/', ProductController.getAllProducts);
router.get('/categories', ProductController.getCategories);
router.get('/brands', ProductController.getBrands);
router.get('/:id', ProductController.getProductById);

// Protected routes (Admin/Staff only)
router.post('/', ProductController.createProduct);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

export default router;
