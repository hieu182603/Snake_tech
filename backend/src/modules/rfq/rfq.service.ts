import { RFQ, IRFQ } from './models/rfq.model.js';
import { RFQType, RFQStatus } from '../../constants/enums.js';

export class RFQService {
    /**
     * Create a new RFQ
     */
    static async createRFQ(rfqData: Partial<IRFQ>) {
        try {
            // Generate RFQ code
            const code = await this.generateRFQCode();

            const rfq = new RFQ({
                ...rfqData,
                code,
                status: RFQStatus.SUBMITTED,
                type: rfqData.type || RFQType.CUSTOM_PC
            });

            return await rfq.save();
        } catch (error) {
            console.error('Create RFQ error:', error);
            throw error;
        }
    }

    /**
     * Get RFQs by user ID with pagination
     */
    static async getRFQsByUserId(userId: string, options: { page: number; limit: number }) {
        try {
            const { page, limit } = options;
            const skip = (page - 1) * limit;

            const [rfqs, total] = await Promise.all([
                RFQ.find({ accountId: userId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('quotation.quotedBy', 'fullName email')
                    .populate('relatedOrderId', 'code status'),
                RFQ.countDocuments({ accountId: userId })
            ]);

            return {
                rfqs,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Get RFQs by user ID error:', error);
            throw error;
        }
    }

    /**
     * Get RFQ by ID with access control
     */
    static async getRFQById(rfqId: string, userId: string, userRole: string) {
        try {
            const rfq = await RFQ.findById(rfqId)
                .populate('quotation.quotedBy', 'fullName email')
                .populate('relatedOrderId', 'code status')
                .populate('attachments');

            if (!rfq) {
                return null;
            }

            // Check access: owner or admin
            if (rfq.accountId.toString() !== userId && userRole !== 'ADMIN') {
                throw new Error('Access denied');
            }

            return rfq;
        } catch (error) {
            console.error('Get RFQ by ID error:', error);
            throw error;
        }
    }

    /**
     * Generate unique RFQ code
     */
    private static async generateRFQCode(): Promise<string> {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');

        // Find the last RFQ created this month
        const lastRFQ = await RFQ.findOne({
            code: new RegExp(`^RFQ${year}${month}`)
        }).sort({ code: -1 });

        let sequence = 1;
        if (lastRFQ) {
            const lastSequence = parseInt(lastRFQ.code.slice(-4));
            sequence = lastSequence + 1;
        }

        return `RFQ${year}${month}${String(sequence).padStart(4, '0')}`;
    }
}
