import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';

interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  date: string;
  items: number;
}

const AdminOrders: React.FC = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const loadOrders = async () => {
      try {
        setLoading(true);
        const mockOrders: Order[] = [
          {
            id: '#ORD-001',
            customerName: 'Nguyễn Văn A',
            totalAmount: 3500000,
            status: 'delivered',
            date: '2024-12-31',
            items: 1
          },
          {
            id: '#ORD-002',
            customerName: 'Trần Thị B',
            totalAmount: 1200000,
            status: 'shipping',
            date: '2024-12-31',
            items: 2
          },
          {
            id: '#ORD-003',
            customerName: 'Lê Văn C',
            totalAmount: 2800000,
            status: 'confirmed',
            date: '2024-12-30',
            items: 1
          }
        ];
        setOrders(mockOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
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
            <h1 className="text-3xl font-black text-text-main tracking-tight">Quản lý đơn hàng</h1>
            <p className="text-text-muted mt-2">Xem và quản lý tất cả đơn hàng</p>
          </div>
          <Button>Xuất báo cáo</Button>
        </div>

        {/* Orders Table */}
        <div className="bg-surface border border-border rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-primary font-bold">{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main">{order.customerName}</p>
                      <p className="text-sm text-text-muted">{order.items} sản phẩm</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-text-main">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{order.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 border border-border rounded-lg text-text-main hover:border-primary transition-colors text-sm">
                          Xem
                        </button>
                        <button className="px-3 py-1 border border-border rounded-lg text-text-main hover:border-primary transition-colors text-sm">
                          Sửa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
