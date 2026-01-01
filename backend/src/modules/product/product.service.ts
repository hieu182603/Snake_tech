import { Product, IProduct } from './models/product.model.js';
import { Category } from './models/category.model.js';
import { Brand } from './models/brand.model.js';

export class ProductService {
    /**
     * Get all products with filters and pagination
     */
    static async getAllProducts(
        filters: {
            category?: string;
            brand?: string;
            minPrice?: number;
            maxPrice?: number;
            search?: string;
        },
        pagination: {
            page: number;
            limit: number;
            sortBy: string;
            sortOrder: string;
        }
    ) {
        try {
            const { category, brand, minPrice, maxPrice, search } = filters;
            const { page, limit, sortBy, sortOrder } = pagination;

            // Build query
            const query: any = { isActive: true };

            // Handle category filter - lookup by name if it's not an ObjectId
            if (category) {
                // Check if category is already an ObjectId (24 hex chars)
                const objectIdRegex = /^[0-9a-fA-F]{24}$/;
                if (objectIdRegex.test(category)) {
                    query.categoryId = category;
                } else {
                    // Lookup category by name
                    const categoryDoc = await Category.findOne({
                        name: { $regex: new RegExp(`^${category}$`, 'i') },
                        isActive: true
                    });
                    if (categoryDoc) {
                        query.categoryId = categoryDoc._id;
                    } else {
                        // If no category found, return empty result
                        return {
                            products: [],
                            pagination: {
                                page,
                                limit,
                                total: 0,
                                totalPages: 0
                            }
                        };
                    }
                }
            }

            // Handle brand filter - lookup by name if it's not an ObjectId
            if (brand) {
                const objectIdRegex = /^[0-9a-fA-F]{24}$/;
                if (objectIdRegex.test(brand)) {
                    query.brandId = brand;
                } else {
                    // Lookup brand by name
                    const brandDoc = await Brand.findOne({
                        name: { $regex: new RegExp(`^${brand}$`, 'i') },
                        isActive: true
                    });
                    if (brandDoc) {
                        query.brandId = brandDoc._id;
                    }
                }
            }
            if (minPrice !== undefined || maxPrice !== undefined) {
                query.price = {};
                if (minPrice !== undefined) query.price.$gte = minPrice;
                if (maxPrice !== undefined) query.price.$lte = maxPrice;
            }
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            // Calculate pagination
            const skip = (page - 1) * limit;

            // Build sort
            const sort: any = {};
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

            // Execute query
            const products = await Product.find(query)
                .populate('categoryId', 'name')
                .populate('brandId', 'name')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select('-__v');

            const total = await Product.countDocuments(query);

            return {
                products,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Get products error:', error);
            throw error;
        }
    }

    /**
     * Get product by ID
     */
    static async getProductById(id: string) {
        try {
            const product = await Product.findById(id)
                .populate('categoryId', 'name description')
                .populate('brandId', 'name description')
                .select('-__v');

            return product;
        } catch (error) {
            console.error('Get product by ID error:', error);
            throw error;
        }
    }

    /**
     * Create new product
     */
    static async createProduct(productData: Partial<IProduct>) {
        try {
            const product = await Product.create(productData);
            return await product.populate('categoryId', 'name').populate('brandId', 'name');
        } catch (error) {
            console.error('Create product error:', error);
            throw error;
        }
    }

    /**
     * Update product
     */
    static async updateProduct(id: string, updateData: Partial<IProduct>) {
        try {
            const product = await Product.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: new Date() },
                { new: true }
            ).populate('categoryId', 'name').populate('brandId', 'name');

            return product;
        } catch (error) {
            console.error('Update product error:', error);
            throw error;
        }
    }

    /**
     * Delete product
     */
    static async deleteProduct(id: string) {
        try {
            const result = await Product.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            console.error('Delete product error:', error);
            throw error;
        }
    }

    /**
     * Get all categories
     */
    static async getCategories() {
        try {
            const categories = await Category.find({ isActive: true })
                .select('name description')
                .sort({ name: 1 });

            return categories;
        } catch (error) {
            console.error('Get categories error:', error);
            throw error;
        }
    }

    /**
     * Get all brands
     */
    static async getBrands() {
        try {
            const brands = await Brand.find({ isActive: true })
                .select('name description')
                .sort({ name: 1 });

            return brands;
        } catch (error) {
            console.error('Get brands error:', error);
            throw error;
        }
    }
}
