import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  joinDate: string;
}

const AdminCustomers: React.FC = () => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const mockCustomers: Customer[] = [
          {
            id: '1',
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            phone: '0901234567',
            ordersCount: 5,
            totalSpent: 12500000,
            status: 'active',
            joinDate: '2024-01-15'
          },
          {
            id: '2',
            name: 'Trần Thị B',
            email: 'tranthib@email.com',
            phone: '0902345678',
            ordersCount: 3,
            totalSpent: 8500000,
            status: 'active',
            joinDate: '2024-03-20'
          }
        ];
        setCustomers(mockCustomers);
      } catch (error) {
        console.error('Error loading customers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-text-main tracking-tight">Quản lý khách hàng</h1>
            <p className="text-text-muted mt-2">Xem và quản lý thông tin khách hàng</p>
          </div>
          <Button>Thêm khách hàng</Button>
        </div>

        <div className="bg-surface border border-border rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">Tên</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">SĐT</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">Đơn hàng</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">Tổng chi</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main">{customer.name}</p>
                      <p className="text-sm text-text-muted">ID: {customer.id}</p>
                    </td>
                    <td className="px-6 py-4 text-text-main">{customer.email}</td>
                    <td className="px-6 py-4 text-text-main font-medium">{customer.phone}</td>
                    <td className="px-6 py-4 text-text-main font-bold">{customer.ordersCount}</td>
                    <td className="px-6 py-4 text-text-main font-bold">{formatCurrency(customer.totalSpent)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        customer.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
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

export default AdminCustomers;
