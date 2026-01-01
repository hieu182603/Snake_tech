import { Request, Response } from 'express';
import { ProductService } from './product.service.js';
import { z } from 'zod';

// Validation schemas
const createProductSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    categoryId: z.string().min(1, 'Category is required'),
    brandId: z.string().min(1, 'Brand is required'),
    images: z.array(z.string()).optional(),
    stock: z.number().min(0, 'Stock cannot be negative').optional(),
    isActive: z.boolean().optional(),
});

const updateProductSchema = createProductSchema.partial();

export class ProductController {
    /**
     * Get all products with pagination and filters
     */
    static async getAllProducts(req: Request, res: Response) {
        try {
            const {
                page = '1',
                limit = '10',
                category,
                brand,
                minPrice,
                maxPrice,
                search,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;

            // Convert limit to number and cap it
            const limitNum = Math.min(parseInt(limit as string) || 10, 100); // Max 100 items

            const filters = {
                category,
                brand,
                minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
                search: search as string,
            };

            const pagination = {
                page: parseInt(page as string),
                limit: limitNum,
                sortBy: sortBy as string,
                sortOrder: sortOrder as string,
            };

            const result = await ProductService.getAllProducts(filters, pagination);
            return res.status(200).json(result);
        } catch (error: any) {
            console.error('Get products error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get product by ID
     */
    static async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await ProductService.getProductById(id);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            return res.status(200).json(product);
        } catch (error: any) {
            if (error.message === 'Product not found') {
                return res.status(404).json({ message: error.message });
            }
            console.error('Get product error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Create new product
     */
    static async createProduct(req: Request, res: Response) {
        try {
            const parse = createProductSchema.safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    message: 'Invalid data',
                    errors: parse.error.flatten()
                });
            }

            const product = await ProductService.createProduct(parse.data);
            return res.status(201).json(product);
        } catch (error: any) {
            console.error('Create product error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update product
     */
    static async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const parse = updateProductSchema.safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    message: 'Invalid data',
                    errors: parse.error.flatten()
                });
            }

            const product = await ProductService.updateProduct(id, parse.data);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            return res.status(200).json(product);
        } catch (error: any) {
            console.error('Update product error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Delete product
     */
    static async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await ProductService.deleteProduct(id);

            if (!result) {
                return res.status(404).json({ message: 'Product not found' });
            }

            return res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error: any) {
            console.error('Delete product error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get all categories
     */
    static async getCategories(req: Request, res: Response) {
        try {
            const categories = await ProductService.getCategories();
            return res.status(200).json(categories);
        } catch (error: any) {
            console.error('Get categories error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get all brands
     */
    static async getBrands(req: Request, res: Response) {
        try {
            const brands = await ProductService.getBrands();
            return res.status(200).json(brands);
        } catch (error: any) {
            console.error('Get brands error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
