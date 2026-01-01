import { Request, Response } from 'express';
import { BannerService } from './banner.service.js';
import { z } from 'zod';

// Validation schemas
const createBannerSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    imageUrl: z.string().url('Invalid image URL'),
    linkUrl: z.string().url().optional(),
    isActive: z.boolean().optional(),
    displayOrder: z.number().min(0).optional(),
});

const updateBannerSchema = createBannerSchema.partial();

export class BannerController {
    /**
     * Get all banners
     */
    static async getAllBanners(req: Request, res: Response) {
        try {
            const banners = await BannerService.getAllBanners();
            return res.status(200).json(banners);
        } catch (error: any) {
            console.error('Get banners error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Create new banner
     */
    static async createBanner(req: Request, res: Response) {
        try {
            const parse = createBannerSchema.safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    message: 'Invalid data',
                    errors: parse.error.flatten()
                });
            }

            const banner = await BannerService.createBanner(parse.data);
            return res.status(201).json(banner);
        } catch (error: any) {
            console.error('Create banner error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update banner
     */
    static async updateBanner(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const parse = updateBannerSchema.safeParse(req.body);
            if (!parse.success) {
                return res.status(400).json({
                    message: 'Invalid data',
                    errors: parse.error.flatten()
                });
            }

            const banner = await BannerService.updateBanner(id, parse.data);
            if (!banner) {
                return res.status(404).json({ message: 'Banner not found' });
            }

            return res.status(200).json(banner);
        } catch (error: any) {
            console.error('Update banner error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Delete banner
     */
    static async deleteBanner(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await BannerService.deleteBanner(id);

            if (!result) {
                return res.status(404).json({ message: 'Banner not found' });
            }

            return res.status(200).json({ message: 'Banner deleted successfully' });
        } catch (error: any) {
            console.error('Delete banner error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
