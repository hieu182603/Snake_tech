import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  todayOrders: number;
  todayRevenue: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  date: string;
}

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    const loadDashboard = async () => {
      try {
        setLoading(true);

        // Mock dashboard stats
        const mockStats: DashboardStats = {
          totalRevenue: 125000000,
          totalOrders: 1250,
          totalCustomers: 850,
          totalProducts: 145,
          todayOrders: 12,
          todayRevenue: 2850000
        };

        // Mock recent orders
        const mockOrders: RecentOrder[] = [
          {
            id: '#ORD-001',
            customerName: 'Nguyễn Văn A',
            totalAmount: 3500000,
            status: 'delivered',
            date: '2024-12-31'
          },
          {
            id: '#ORD-002',
            customerName: 'Trần Thị B',
            totalAmount: 1200000,
            status: 'shipping',
            date: '2024-12-31'
          },
          {
            id: '#ORD-003',
            customerName: 'Lê Văn C',
            totalAmount: 2800000,
            status: 'confirmed',
            date: '2024-12-30'
          }
        ];

        setStats(mockStats);
        setRecentOrders(mockOrders);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-emerald-400 bg-emerald-500/10';
      case 'shipping': return 'text-blue-400 bg-blue-500/10';
      case 'confirmed': return 'text-yellow-400 bg-yellow-500/10';
      case 'cancelled': return 'text-red-400 bg-red-500/10';
      default: return 'text-text-muted bg-border/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Đã giao';
      case 'shipping': return 'Đang giao';
      case 'confirmed': return 'Đã xác nhận';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-text-main tracking-tight">{t('admin.dashboard')}</h1>
            <p className="text-text-muted mt-2">Tổng quan hệ thống quản trị</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-border rounded-xl text-text-main hover:border-primary transition-colors text-sm font-bold">
              Xuất báo cáo
            </button>
            <button className="px-4 py-2 bg-primary text-black rounded-xl hover:bg-primary/80 transition-colors text-sm font-bold">
              Làm mới
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface border border-border rounded-3xl p-6 animate-pulse">
                <div className="h-4 bg-border rounded mb-2"></div>
                <div className="h-8 bg-border rounded mb-4"></div>
                <div className="h-3 bg-border rounded"></div>
              </div>
            ))}
          </div>
        ) : stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-surface border border-border rounded-3xl p-6 hover:border-emerald-500/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="size-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-500">payments</span>
                </div>
                <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
                  +12.5%
                </span>
              </div>
              <h3 className="text-2xl font-black text-text-main mb-1">{formatCurrency(stats.totalRevenue)}</h3>
              <p className="text-text-muted text-sm font-bold">Tổng doanh thu</p>
            </div>

            {/* Total Orders */}
            <div className="bg-surface border border-border rounded-3xl p-6 hover:border-blue-500/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="size-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-500">shopping_cart</span>
                </div>
                <span className="text-blue-500 text-xs font-bold bg-blue-500/10 px-2 py-1 rounded-full">
                  +5.2%
                </span>
              </div>
              <h3 className="text-2xl font-black text-text-main mb-1">{stats.totalOrders.toLocaleString()}</h3>
              <p className="text-text-muted text-sm font-bold">Tổng đơn hàng</p>
            </div>

            {/* Total Customers */}
            <div className="bg-surface border border-border rounded-3xl p-6 hover:border-purple-500/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="size-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-purple-500">group_add</span>
                </div>
                <span className="text-purple-500 text-xs font-bold bg-purple-500/10 px-2 py-1 rounded-full">
                  +8.4%
                </span>
              </div>
              <h3 className="text-2xl font-black text-text-main mb-1">{stats.totalCustomers.toLocaleString()}</h3>
              <p className="text-text-muted text-sm font-bold">Tổng khách hàng</p>
            </div>

            {/* Total Products */}
            <div className="bg-surface border border-border rounded-3xl p-6 hover:border-orange-500/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="size-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-orange-500">inventory</span>
                </div>
                <span className="text-orange-500 text-xs font-bold bg-orange-500/10 px-2 py-1 rounded-full">
                  +3.1%
                </span>
              </div>
              <h3 className="text-2xl font-black text-text-main mb-1">{stats.totalProducts.toLocaleString()}</h3>
              <p className="text-text-muted text-sm font-bold">Tổng sản phẩm</p>
            </div>
          </div>
        )}

        {/* Recent Orders & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-main">Đơn hàng gần đây</h2>
              <button className="text-primary hover:text-primary/80 text-sm font-bold">Xem tất cả</button>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-background rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-text-muted">receipt</span>
                    </div>
                    <div>
                      <p className="font-bold text-text-main text-sm">{order.id}</p>
                      <p className="text-text-muted text-xs">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-text-main">{formatCurrency(order.totalAmount)}</p>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface border border-border rounded-3xl p-6">
            <h2 className="text-xl font-bold text-text-main mb-6">Thao tác nhanh</h2>

            <div className="space-y-3">
              <button className="w-full p-4 bg-primary text-black rounded-xl hover:bg-primary/80 transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">add_circle</span>
                  <div>
                    <p className="font-bold">Thêm sản phẩm</p>
                    <p className="text-sm opacity-80">Thêm sản phẩm mới</p>
                  </div>
                </div>
              </button>

              <button className="w-full p-4 border border-border rounded-xl hover:border-primary transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-text-muted group-hover:text-primary">inventory</span>
                  <div>
                    <p className="font-bold text-text-main">Quản lý sản phẩm</p>
                    <p className="text-sm text-text-muted">Xem và chỉnh sửa</p>
                  </div>
                </div>
              </button>

              <button className="w-full p-4 border border-border rounded-xl hover:border-primary transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-text-muted group-hover:text-primary">shopping_cart</span>
                  <div>
                    <p className="font-bold text-text-main">Quản lý đơn hàng</p>
                    <p className="text-sm text-text-muted">Xem đơn hàng mới</p>
                  </div>
                </div>
              </button>

              <button className="w-full p-4 border border-border rounded-xl hover:border-primary transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-text-muted group-hover:text-primary">analytics</span>
                  <div>
                    <p className="font-bold text-text-main">Báo cáo</p>
                    <p className="text-sm text-text-muted">Xem thống kê</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
