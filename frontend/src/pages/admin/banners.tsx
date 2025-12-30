import React from 'react';
import Button from '@/components/ui/Button';

const AdminBanners: React.FC = () => {
  const banners = [
    { id: 1, title: 'Flash Sale Gaming Gear', status: 'active', views: 12500, clicks: 1250 },
    { id: 2, title: 'New Laptop Collection', status: 'active', views: 8900, clicks: 890 },
    { id: 3, title: 'Holiday Promotion', status: 'inactive', views: 5600, clicks: 560 },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-text-main tracking-tight">Quản lý banner</h1>
            <p className="text-text-muted mt-2">Quản lý banner quảng cáo trên website</p>
          </div>
          <Button>Thêm banner</Button>
        </div>

        <div className="space-y-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-surface border border-border rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-16 bg-background border border-border rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-text-muted">image</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-main">{banner.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        banner.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {banner.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                      <span className="text-sm text-text-muted">
                        {banner.views.toLocaleString()} lượt xem • {banner.clicks.toLocaleString()} lượt click
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button size="sm" variant="outline">Chỉnh sửa</Button>
                  <Button size="sm" variant="outline">Xem thống kê</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBanners;
