import { Order } from '../order/models/order.model.js';
import { Product } from '../product/models/product.model.js';
import { Account } from '../auth/models/account.model.js';

export class ReportsService {
  async generateSalesReport(startDate?: string, endDate?: string, format: string = 'json') {
    try {
      const matchStage: any = {
        status: { $in: ['DELIVERED', 'COMPLETED'] }
      };

      if (startDate && endDate) {
        matchStage.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const salesData = await Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$total' },
            averageOrderValue: { $avg: '$total' }
          }
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: {
                  $dateFromParts: {
                    year: '$_id.year',
                    month: '$_id.month',
                    day: '$_id.day'
                  }
                }
              }
            },
            totalOrders: 1,
            totalRevenue: 1,
            averageOrderValue: 1
          }
        },
        { $sort: { date: 1 } }
      ]);

      const summary = {
        totalOrders: salesData.reduce((sum, item) => sum + item.totalOrders, 0),
        totalRevenue: salesData.reduce((sum, item) => sum + item.totalRevenue, 0),
        averageOrderValue: salesData.length > 0
          ? salesData.reduce((sum, item) => sum + item.averageOrderValue, 0) / salesData.length
          : 0,
        period: {
          startDate: startDate || 'All time',
          endDate: endDate || 'Present'
        }
      };

      return {
        type: 'sales',
        summary,
        data: salesData,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Generate sales report error:', error);
      throw error;
    }
  }

  async generateOrdersReport(startDate?: string, endDate?: string, status?: string, format: string = 'json') {
    try {
      const matchStage: any = {};

      if (startDate && endDate) {
        matchStage.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      if (status) {
        matchStage.status = status;
      }

      const orders = await Order.find(matchStage)
        .populate('accountId', 'fullName email')
        .sort({ createdAt: -1 })
        .select('code total status createdAt accountId items');

      const summary = {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
        ordersByStatus: orders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        period: {
          startDate: startDate || 'All time',
          endDate: endDate || 'Present'
        }
      };

      return {
        type: 'orders',
        summary,
        data: orders,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Generate orders report error:', error);
      throw error;
    }
  }

  async generateProductsReport(category?: string, format: string = 'json') {
    try {
      const matchStage: any = { isActive: true };

      if (category) {
        matchStage.categoryId = category;
      }

      const products = await Product.find(matchStage)
        .populate('categoryId', 'name')
        .populate('brandId', 'name')
        .select('name price stock categoryId brandId createdAt');

      // Get sales data for each product
      const productIds = products.map(p => p._id);
      const salesData = await Order.aggregate([
        { $unwind: '$items' },
        { $match: { 'items.productId': { $in: productIds } } },
        {
          $group: {
            _id: '$items.productId',
            totalSold: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
          }
        }
      ]);

      const salesMap = salesData.reduce((acc, item) => {
        acc[item._id.toString()] = item;
        return acc;
      }, {} as Record<string, any>);

      const productsWithSales = products.map(product => ({
        ...product.toObject(),
        totalSold: salesMap[product._id.toString()]?.totalSold || 0,
        totalRevenue: salesMap[product._id.toString()]?.totalRevenue || 0
      }));

      const summary = {
        totalProducts: products.length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
        lowStockProducts: products.filter(p => p.stock < 10).length,
        outOfStockProducts: products.filter(p => p.stock === 0).length
      };

      return {
        type: 'products',
        summary,
        data: productsWithSales,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Generate products report error:', error);
      throw error;
    }
  }

  async generateCustomersReport(format: string = 'json') {
    try {
      const customers = await Account.find({ role: 'CUSTOMER' })
        .select('fullName email phone isActive isVerified createdAt');

      // Get order statistics for each customer
      const customerIds = customers.map(c => c._id);
      const orderStats = await Order.aggregate([
        { $match: { accountId: { $in: customerIds } } },
        {
          $group: {
            _id: '$accountId',
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$total' },
            lastOrderDate: { $max: '$createdAt' },
            statusCounts: {
              $push: '$status'
            }
          }
        }
      ]);

      const statsMap = orderStats.reduce((acc, stat) => {
        acc[stat._id.toString()] = stat;
        return acc;
      }, {} as Record<string, any>);

      const customersWithStats = customers.map(customer => {
        const stats = statsMap[customer._id.toString()] || {};
        return {
          ...customer.toObject(),
          totalOrders: stats.totalOrders || 0,
          totalSpent: stats.totalSpent || 0,
          lastOrderDate: stats.lastOrderDate,
          completedOrders: stats.statusCounts?.filter((s: string) => ['DELIVERED', 'COMPLETED'].includes(s)).length || 0
        };
      });

      const summary = {
        totalCustomers: customers.length,
        activeCustomers: customers.filter(c => c.isActive).length,
        verifiedCustomers: customers.filter(c => c.isVerified).length,
        totalRevenue: customersWithStats.reduce((sum, c) => sum + c.totalSpent, 0)
      };

      return {
        type: 'customers',
        summary,
        data: customersWithStats,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Generate customers report error:', error);
      throw error;
    }
  }

  async generateReport(type: string, startDate?: string, endDate?: string, format: string = 'pdf') {
    try {
      let reportData;

      switch (type) {
        case 'sales':
          reportData = await this.generateSalesReport(startDate, endDate, 'json');
          break;
        case 'orders':
          reportData = await this.generateOrdersReport(startDate, endDate, undefined, 'json');
          break;
        case 'products':
          reportData = await this.generateProductsReport(undefined, 'json');
          break;
        case 'customers':
          reportData = await this.generateCustomersReport('json');
          break;
        default:
          throw new Error('Invalid report type');
      }

      // For now, return JSON. In production, you'd generate actual PDF/Excel files
      return reportData;
    } catch (error) {
      console.error('Generate report error:', error);
      throw error;
    }
  }
}

