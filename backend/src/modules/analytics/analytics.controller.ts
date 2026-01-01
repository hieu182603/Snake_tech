import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service.js';

export class AnalyticsController {
  private analyticsService = new AnalyticsService();

  async getOverview(req: Request, res: Response) {
    try {
      const overview = await this.analyticsService.getOverview();
      res.json(overview);
    } catch (error) {
      console.error('Analytics overview error:', error);
      res.status(500).json({ message: 'Failed to fetch analytics overview' });
    }
  }

  async getSalesAnalytics(req: Request, res: Response) {
    try {
      const { startDate, endDate, period = 'month' } = req.query;
      const analytics = await this.analyticsService.getSalesAnalytics(
        startDate as string,
        endDate as string,
        period as string
      );
      res.json(analytics);
    } catch (error) {
      console.error('Sales analytics error:', error);
      res.status(500).json({ message: 'Failed to fetch sales analytics' });
    }
  }

  async getProductAnalytics(req: Request, res: Response) {
    try {
      const analytics = await this.analyticsService.getProductAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Product analytics error:', error);
      res.status(500).json({ message: 'Failed to fetch product analytics' });
    }
  }

  async getCustomerAnalytics(req: Request, res: Response) {
    try {
      const analytics = await this.analyticsService.getCustomerAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Customer analytics error:', error);
      res.status(500).json({ message: 'Failed to fetch customer analytics' });
    }
  }

  async getRevenueChart(req: Request, res: Response) {
    try {
      const { startDate, endDate, period = 'month' } = req.query;
      const chart = await this.analyticsService.getRevenueChart(
        startDate as string,
        endDate as string,
        period as string
      );
      res.json(chart);
    } catch (error) {
      console.error('Revenue chart error:', error);
      res.status(500).json({ message: 'Failed to fetch revenue chart' });
    }
  }
}

