import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';

export class DashboardController {
    /**
     * Get dashboard stats for authenticated user
     */
    static async getDashboardStats(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const stats = await DashboardService.getUserDashboardStats(userId);
            return res.status(200).json(stats);
        } catch (error: any) {
            console.error('Get dashboard stats error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
