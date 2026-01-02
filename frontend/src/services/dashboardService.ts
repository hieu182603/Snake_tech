import type { DashboardStats, RevenueStats } from '@/types/product';

export class DashboardService {
  private static instance: DashboardService;

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Mock data for now - replace with actual API call
      const mockStats: DashboardStats = {
        totalRevenue: 250000000,
        totalOrders: 1234,
        totalCustomers: 567,
        totalProducts: 89,
        totalShippers: 12,
        totalFeedbacks: 45,
        recentOrders: [
          {
            id: '1',
            orderNumber: 'ORD-2024-001',
            customerName: 'Nguyễn Văn A',
            totalAmount: 15000000,
            status: 'DELIVERED',
            createdAt: new Date().toISOString(),
            itemsCount: 2
          },
          {
            id: '2',
            orderNumber: 'ORD-2024-002',
            customerName: 'Trần Thị B',
            totalAmount: 25000000,
            status: 'SHIPPING',
            createdAt: new Date().toISOString(),
            itemsCount: 1
          }
        ],
        topProducts: [
          {
            id: '1',
            name: 'Laptop Gaming XYZ',
            price: 25000000,
            totalSold: 45,
            totalRevenue: 1125000000
          },
          {
            id: '2',
            name: 'Mouse Gaming ABC',
            price: 1500000,
            totalSold: 78,
            totalRevenue: 117000000
          }
        ],
        orderStatusDistribution: {
          PENDING: 12,
          CONFIRMED: 25,
          SHIPPING: 18,
          DELIVERED: 156,
          CANCELLED: 8
        },
        monthlyRevenue: [
          { month: '2024-01', revenue: 150000000 },
          { month: '2024-02', revenue: 180000000 },
          { month: '2024-03', revenue: 220000000 },
          { month: '2024-04', revenue: 190000000 },
          { month: '2024-05', revenue: 250000000 },
          { month: '2024-06', revenue: 280000000 }
        ]
      };

      return mockStats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getRevenueStats(
    startDate: string,
    endDate: string,
    period: 'day' | 'month' | 'year' = 'month'
  ): Promise<RevenueStats> {
    try {
      // Mock data for now - replace with actual API call
      const mockRevenueStats: RevenueStats = {
        period,
        totalRevenue: 250000000,
        totalOrders: 1234,
        averageOrderValue: 202500,
        data: [
          { date: '2024-01-01', revenue: 15000000, orders: 45 },
          { date: '2024-01-02', revenue: 18000000, orders: 52 },
          { date: '2024-01-03', revenue: 22000000, orders: 61 },
          { date: '2024-01-04', revenue: 19000000, orders: 48 },
          { date: '2024-01-05', revenue: 25000000, orders: 67 },
          { date: '2024-01-06', revenue: 28000000, orders: 73 }
        ]
      };

      return mockRevenueStats;
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      throw error;
    }
  }
}
