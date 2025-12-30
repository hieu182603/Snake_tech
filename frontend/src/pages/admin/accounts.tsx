import React from 'react';
import Button from '@/components/ui/Button';

const AdminAccounts: React.FC = () => {
  const accounts = [
    { id: 1, username: 'admin', email: 'admin@techstore.vn', role: 'Administrator', status: 'active', lastLogin: '2024-12-31' },
    { id: 2, username: 'manager', email: 'manager@techstore.vn', role: 'Manager', status: 'active', lastLogin: '2024-12-30' },
    { id: 3, username: 'staff1', email: 'staff1@techstore.vn', role: 'Staff', status: 'inactive', lastLogin: '2024-12-28' },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-text-main tracking-tight">Quản lý tài khoản</h1>
            <p className="text-text-muted mt-2">Quản lý tài khoản người dùng và phân quyền</p>
          </div>
          <Button>Thêm tài khoản</Button>
        </div>

        <div className="bg-surface border border-border rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">Tên đăng nhập</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">Đăng nhập cuối</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-text-main">{account.username}</td>
                  <td className="px-6 py-4 text-text-main">{account.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                      {account.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      account.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {account.status === 'active' ? 'Hoạt động' : 'Khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{account.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 border border-border rounded-lg text-text-main hover:border-primary transition-colors text-sm">
                        Sửa
                      </button>
                      <button className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm">
                        Xóa
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
  );
};

export default AdminAccounts;
