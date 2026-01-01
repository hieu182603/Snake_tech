import { Request, Response } from 'express';
import { ReportsService } from './reports.service.js';

export class ReportsController {
  private reportsService = new ReportsService();

  async getSalesReport(req: Request, res: Response) {
    try {
      const { startDate, endDate, format = 'json' } = req.query;
      const report = await this.reportsService.generateSalesReport(
        startDate as string,
        endDate as string,
        format as string
      );
      res.json(report);
    } catch (error) {
      console.error('Sales report error:', error);
      res.status(500).json({ message: 'Failed to generate sales report' });
    }
  }

  async getOrdersReport(req: Request, res: Response) {
    try {
      const { startDate, endDate, status, format = 'json' } = req.query;
      const report = await this.reportsService.generateOrdersReport(
        startDate as string,
        endDate as string,
        status as string,
        format as string
      );
      res.json(report);
    } catch (error) {
      console.error('Orders report error:', error);
      res.status(500).json({ message: 'Failed to generate orders report' });
    }
  }

  async getProductsReport(req: Request, res: Response) {
    try {
      const { category, format = 'json' } = req.query;
      const report = await this.reportsService.generateProductsReport(
        category as string,
        format as string
      );
      res.json(report);
    } catch (error) {
      console.error('Products report error:', error);
      res.status(500).json({ message: 'Failed to generate products report' });
    }
  }

  async getCustomersReport(req: Request, res: Response) {
    try {
      const { format = 'json' } = req.query;
      const report = await this.reportsService.generateCustomersReport(format as string);
      res.json(report);
    } catch (error) {
      console.error('Customers report error:', error);
      res.status(500).json({ message: 'Failed to generate customers report' });
    }
  }

  async exportReport(req: Request, res: Response) {
    try {
      const { type, startDate, endDate, format = 'pdf' } = req.query;

      const reportData = await this.reportsService.generateReport(
        type as string,
        startDate as string,
        endDate as string,
        format as string
      );

      if (format === 'pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${type}-report.pdf`);
      } else if (format === 'excel') {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${type}-report.xlsx`);
      }

      res.send(reportData);
    } catch (error) {
      console.error('Export report error:', error);
      res.status(500).json({ message: 'Failed to export report' });
    }
  }
}

