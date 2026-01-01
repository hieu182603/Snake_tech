import { Banner } from './models/banner.model.js';

export class BannerService {
    /**
     * Get all active banners
     */
    static async getAllBanners() {
        try {
            const banners = await Banner.find({ isActive: true })
                .sort({ displayOrder: 1, createdAt: -1 })
                .select('-__v');

            return banners;
        } catch (error) {
            console.error('Get banners error:', error);
            throw error;
        }
    }

    /**
     * Create new banner
     */
    static async createBanner(bannerData: any) {
        try {
            const banner = await Banner.create(bannerData);
            return banner;
        } catch (error) {
            console.error('Create banner error:', error);
            throw error;
        }
    }

    /**
     * Update banner
     */
    static async updateBanner(id: string, updateData: any) {
        try {
            const banner = await Banner.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: new Date() },
                { new: true }
            );

            return banner;
        } catch (error) {
            console.error('Update banner error:', error);
            throw error;
        }
    }

    /**
     * Delete banner
     */
    static async deleteBanner(id: string) {
        try {
            const result = await Banner.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            console.error('Delete banner error:', error);
            throw error;
        }
    }
}
