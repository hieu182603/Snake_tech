import React from 'react';
import Button from '@/components/ui/Button';

const AdminShippers: React.FC = () => {
  const shippers = [
    { id: 1, name: 'Nguyễn Văn Ship', phone: '0901234567', email: 'shipper1@techstore.vn', status: 'active', deliveries: 145, rating: 4.8 },
    { id: 2, name: 'Trần Thị Fast', phone: '0902345678', email: 'shipper2@techstore.vn', status: 'active', deliveries: 132, rating: 4.9 },
    { id: 3, name: 'Lê Văn Quick', phone: '0903456789', email: 'shipper3@techstore.vn', status: 'inactive', deliveries: 98, rating: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-text-main tracking-tight">Quản lý shipper</h1>
            <p className="text-text-muted mt-2">Quản lý đội ngũ giao hàng</p>
          </div>
          <Button>Thêm shipper</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shippers.map((shipper) => (
            <div key={shipper.id} className="bg-surface border border-border rounded-3xl p-6 hover:border-primary/50 transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                </div>
                <div>
                  <h3 className="font-bold text-text-main">{shipper.name}</h3>
                  <p className="text-sm text-text-muted">{shipper.phone}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Email:</span>
                  <span className="text-sm text-text-main">{shipper.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Đơn hàng:</span>
                  <span className="text-sm font-bold text-text-main">{shipper.deliveries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Đánh giá:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-yellow-500">{shipper.rating}</span>
                    <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Trạng thái:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    shipper.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {shipper.status === 'active' ? 'Hoạt động' : 'Tạm nghỉ'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button size="sm" variant="outline" className="flex-1">Xem chi tiết</Button>
                <Button size="sm" variant="outline" className="flex-1">Chỉnh sửa</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminShippers;
