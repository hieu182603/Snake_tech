import { Order } from '../order/models/order.model.js';
import { Product } from '../product/models/product.model.js';
import { Account } from '../auth/models/account.model.js';

export class AnalyticsService {
  async getOverview() {
    try {
      // Tổng quan
      const totalOrders = await Order.countDocuments();
      const totalRevenue = await Order.aggregate([
        { $match: { status: { $in: ['DELIVERED', 'COMPLETED'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]);

      const totalCustomers = await Account.countDocuments({ role: 'CUSTOMER' });
      const totalProducts = await Product.countDocuments({ isActive: true });

      // Đơn hàng gần đây
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('accountId', 'fullName email')
        .select('code total status createdAt');

      // Sản phẩm bán chạy
      const topProducts = await Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            totalSold: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $project: {
            _id: 0,
            productId: '$_id',
            name: '$product.name',
            totalSold: 1,
            totalRevenue: 1
          }
        }
      ]);

      return {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalCustomers,
        totalProducts,
        recentOrders,
        topProducts
      };
    } catch (error) {
      console.error('Analytics overview error:', error);
      throw error;
    }
  }

  async getSalesAnalytics(startDate?: string, endDate?: string, period: string = 'month') {
    try {
      const matchStage: any = {};

      if (startDate && endDate) {
        matchStage.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      matchStage.status = { $in: ['DELIVERED', 'COMPLETED'] };

      const groupStage: any = {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      };

      if (period === 'month') {
        groupStage.$group._id = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
      } else if (period === 'week') {
        groupStage.$group._id = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
      } else if (period === 'day') {
        groupStage.$group._id = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
      }

      const results = await Order.aggregate([
        { $match: matchStage },
        groupStage,
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);

      return {
        period,
        data: results,
        summary: {
          totalOrders: results.reduce((sum, item) => sum + item.totalOrders, 0),
          totalRevenue: results.reduce((sum, item) => sum + item.totalRevenue, 0),
          averageOrderValue: results.length > 0
            ? results.reduce((sum, item) => sum + item.averageOrderValue, 0) / results.length
            : 0
        }
      };
    } catch (error) {
      console.error('Sales analytics error:', error);
      throw error;
    }
  }

  async getProductAnalytics() {
    try {
      const productStats = await Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            totalSold: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
            orderCount: { $addToSet: '$_id' }
          }
        },
        {
          $project: {
            _id: 0,
            productId: '$_id',
            totalSold: 1,
            totalRevenue: 1,
            orderCount: { $size: '$orderCount' }
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $project: {
            productId: 1,
            name: '$product.name',
            category: '$product.categoryId',
            totalSold: 1,
            totalRevenue: 1,
            orderCount: 1
          }
        }
      ]);

      return productStats;
    } catch (error) {
      console.error('Product analytics error:', error);
      throw error;
    }
  }

  async getCustomerAnalytics() {
    try {
      const customerStats = await Order.aggregate([
        {
          $group: {
            _id: '$accountId',
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$total' },
            lastOrderDate: { $max: '$createdAt' },
            orderDates: { $push: '$createdAt' }
          }
        },
        {
          $project: {
            _id: 0,
            customerId: '$_id',
            totalOrders: 1,
            totalSpent: 1,
            lastOrderDate: 1,
            averageOrderValue: { $divide: ['$totalSpent', '$totalOrders'] }
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'accounts',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer'
          }
        },
        { $unwind: '$customer' },
        {
          $project: {
            customerId: 1,
            customerName: '$customer.fullName',
            customerEmail: '$customer.email',
            totalOrders: 1,
            totalSpent: 1,
            lastOrderDate: 1,
            averageOrderValue: 1
          }
        }
      ]);

      return customerStats;
    } catch (error) {
      console.error('Customer analytics error:', error);
      throw error;
    }
  }

  async getRevenueChart(startDate?: string, endDate?: string, period: string = 'month') {
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

      let dateFormat: any;

      if (period === 'month') {
        dateFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
      } else if (period === 'week') {
        dateFormat = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
      } else {
        dateFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
      }

      const chartData = await Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: dateFormat,
            revenue: { $sum: '$total' },
            orders: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            date: '$_id',
            revenue: 1,
            orders: 1
          }
        },
        { $sort: { 'date.year': 1, 'date.month': 1, 'date.day': 1 } }
      ]);

      return chartData;
    } catch (error) {
      console.error('Revenue chart error:', error);
      throw error;
    }
  }
}

