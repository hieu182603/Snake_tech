import React from 'react';
import Button from '@/components/ui/Button';

const AdminReports: React.FC = () => {
  const reports = [
    { name: 'Báo cáo doanh thu', description: 'Thống kê doanh thu theo tháng/quý', icon: 'payments', color: 'emerald' },
    { name: 'Báo cáo đơn hàng', description: 'Phân tích đơn hàng và tỷ lệ chuyển đổi', icon: 'shopping_cart', color: 'blue' },
    { name: 'Báo cáo sản phẩm', description: 'Thống kê sản phẩm bán chạy và tồn kho', icon: 'inventory', color: 'purple' },
    { name: 'Báo cáo khách hàng', description: 'Phân tích hành vi khách hàng', icon: 'group_add', color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-text-main tracking-tight">Báo cáo hệ thống</h1>
            <p className="text-text-muted mt-2">Xuất và tải xuống các báo cáo chi tiết</p>
          </div>
          <Button>Xuất tất cả</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <div key={index} className="bg-surface border border-border rounded-3xl p-6 hover:border-primary/50 transition-all group">
              <div className="flex items-start gap-4">
                <div className={`size-12 bg-${report.color}-500/10 rounded-xl flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-${report.color}-500`}>{report.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-main mb-2">{report.name}</h3>
                  <p className="text-text-muted mb-4">{report.description}</p>
                  <div className="flex gap-3">
                    <Button size="sm" variant="outline">Xem báo cáo</Button>
                    <Button size="sm">Tải xuống</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
