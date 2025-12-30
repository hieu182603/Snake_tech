import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const AdminAnalytics: React.FC = () => {
  const { t } = useTranslation();

  const analyticsData = [
    { label: 'Tổng doanh thu', value: '125.000.000đ', change: '+12.5%', positive: true },
    { label: 'Đơn hàng mới', value: '1,250', change: '+5.2%', positive: true },
    { label: 'Khách hàng mới', value: '850', change: '+8.4%', positive: true },
    { label: 'Tỷ lệ chuyển đổi', value: '3.2%', change: '-0.3%', positive: false },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-text-main tracking-tight">Phân tích dữ liệu</h1>
            <p className="text-text-muted mt-2">Thống kê và báo cáo chi tiết</p>
          </div>
          <div className="flex gap-3">
            <select className="bg-surface border border-border rounded-xl px-4 py-2 text-text-main">
              <option>Hôm nay</option>
              <option>7 ngày qua</option>
              <option>Tháng này</option>
              <option>Năm nay</option>
            </select>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analyticsData.map((item, index) => (
            <div key={index} className="bg-surface border border-border rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  item.positive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {item.change}
                </span>
              </div>
              <h3 className="text-2xl font-black text-text-main mb-1">{item.value}</h3>
              <p className="text-text-muted text-sm font-bold">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface border border-border rounded-3xl p-8">
            <h3 className="text-xl font-bold text-text-main mb-6">Doanh thu theo tháng</h3>
            <div className="h-64 bg-background rounded-xl flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl text-text-muted mb-2 block">bar_chart</span>
                <p className="text-text-muted">Biểu đồ doanh thu sẽ hiển thị ở đây</p>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-3xl p-8">
            <h3 className="text-xl font-bold text-text-main mb-6">Sản phẩm bán chạy</h3>
            <div className="space-y-4">
              {[
                { name: 'Gaming Laptop RTX 4070', sales: 45, revenue: '157.500.000đ' },
                { name: 'Mechanical Keyboard RGB', sales: 32, revenue: '38.400.000đ' },
                { name: 'Gaming Mouse Wireless', sales: 28, revenue: '22.400.000đ' },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                  <div>
                    <p className="font-bold text-text-main">{product.name}</p>
                    <p className="text-sm text-text-muted">{product.sales} đã bán</p>
                  </div>
                  <p className="font-bold text-primary">{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
