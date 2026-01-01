import { Review } from './models/review.model.js';

export class FeedbackService {
    /**
     * Get product feedback
     */
    static async getProductFeedback(productId: string) {
        try {
            const feedback = await Review.find({ productId, status: 'APPROVED' })
                .populate('accountId', 'username fullName')
                .sort({ createdAt: -1 });

            return feedback;
        } catch (error) {
            console.error('Get product feedback error:', error);
            throw error;
        }
    }

    /**
     * Create feedback
     */
    static async createFeedback(userId: string, feedbackData: any) {
        try {
            const feedback = await Review.create({
                accountId: userId,
                ...feedbackData
            });

            return feedback;
        } catch (error) {
            console.error('Create feedback error:', error);
            throw error;
        }
    }

    /**
     * Update feedback
     */
    static async updateFeedback(feedbackId: string, userId: string, updateData: any) {
        try {
            const feedback = await Review.findOneAndUpdate(
                { _id: feedbackId, accountId: userId },
                { ...updateData, updatedAt: new Date() },
                { new: true }
            );

            return feedback;
        } catch (error) {
            console.error('Update feedback error:', error);
            throw error;
        }
    }

    /**
     * Delete feedback
     */
    static async deleteFeedback(feedbackId: string, userId: string) {
        try {
            const result = await Review.findOneAndDelete({ _id: feedbackId, accountId: userId });
            return !!result;
        } catch (error) {
            console.error('Delete feedback error:', error);
            throw error;
        }
    }

    /**
     * Get all feedback (Admin/Staff)
     */
    static async getAllFeedback(page: number = 1, limit: number = 10, search?: string, status?: string) {
        try {
            const skip = (page - 1) * limit;

            // Build filter
            const filter: any = {};
            if (status && status !== 'ALL') {
                filter.status = status;
            }
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } },
                    { 'accountId.username': { $regex: search, $options: 'i' } },
                    { 'accountId.fullName': { $regex: search, $options: 'i' } },
                    { 'productId.name': { $regex: search, $options: 'i' } }
                ];
            }

            const total = await Review.countDocuments(filter);
            const feedbacks = await Review.find(filter)
                .populate('accountId', 'username fullName email')
                .populate('productId', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            return {
                feedbacks,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Get all feedback error:', error);
            throw error;
        }
    }
}
