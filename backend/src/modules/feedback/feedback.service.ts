import { Feedback } from './models/review.model.js';

export class FeedbackService {
    /**
     * Get product feedback
     */
    static async getProductFeedback(productId: string) {
        try {
            const feedback = await Feedback.find({ productId, isActive: true })
                .populate('userId', 'username fullName')
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
            const feedback = await Feedback.create({
                userId,
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
            const feedback = await Feedback.findOneAndUpdate(
                { _id: feedbackId, userId },
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
            const result = await Feedback.findOneAndDelete({ _id: feedbackId, userId });
            return !!result;
        } catch (error) {
            console.error('Delete feedback error:', error);
            throw error;
        }
    }
}
