'use client';

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { AdminLayoutContext } from './AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

// --- Mock Data ---
const salesData = [
  { name: 'T2', current: 12, previous: 8 },
  { name: 'T3', current: 18, previous: 15 },
  { name: 'T4', current: 15, previous: 20 },
  { name: 'T5', current: 25, previous: 18 },
  { name: 'T6', current: 32, previous: 24 },
  { name: 'T7', current: 45, previous: 38 },
  { name: 'CN', current: 38, previous: 30 },
];

const trafficSource = [
  { name: 'Google Search', value: 45, color: '#3B82F6' },
  { name: 'Social Media', value: 30, color: '#8B5CF6' },
  { name: 'Direct', value: 15, color: '#10B981' },
  { name: 'Referral', value: 10, color: '#F59E0B' },
];

const pendingActions = [
  { id: 1, label: 'Đơn hàng chờ xác nhận', count: 12, icon: 'shopping_bag', color: 'text-blue-500', link: '/admin/orders?status=pending' },
  { id: 2, label: 'Sản phẩm sắp hết hàng', count: 5, icon: 'inventory_2', color: 'text-orange-500', link: '/admin/products?filter=low_stock' },
  { id: 3, label: 'Yêu cầu khiếu nại/đổi trả', count: 3, icon: 'assignment_return', color: 'text-red-500', link: '/admin/feedback' },
  { id: 4, label: 'Đánh giá mới cần duyệt', count: 8, icon: 'star', color: 'text-yellow-500', link: '/admin/feedback' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  const context = useContext(AdminLayoutContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { getDateRangeLabel } = context;

  // Helper for currency
  const fmt = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main tracking-tight">Dashboard Overview</h1>
          <p className="text-text-muted text-sm mt-1">
            Số liệu kinh doanh: <span className="text-primary font-bold">{getDateRangeLabel()}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon="calendar_today" size="sm" className="hidden sm:flex">{t('admin.schedule', { defaultValue: 'Lên lịch' })}</Button>
          <Button variant="primary" icon="refresh" size="sm">{t('admin.refreshData', { defaultValue: 'Cập nhật dữ liệu' })}</Button>
        </div>
      </div>

      {/* 2. Action Center (New Feature) - Quick access to operations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pendingActions.map((action) => (
          <Link key={action.id} href={action.link || '#'} className="bg-surface-dark border border-border-dark p-4 rounded-2xl flex items-center justify-between hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all group">
             <div className="flex items-center gap-3">
                <div className={`size-10 rounded-full bg-background-dark flex items-center justify-center border border-border-dark group-hover:border-transparent transition-colors ${action.color.replace('text-', 'bg-')}/10`}>
                   <span className={`material-symbols-outlined ${action.color}`}>{action.icon}</span>
                </div>
                <div>
                   <h4 className="font-bold text-text-main text-2xl leading-none">{action.count}</h4>
                   <p className="text-[11px] text-text-muted font-bold uppercase mt-1">{action.label}</p>
                </div>
             </div>
             <span className="material-symbols-outlined text-text-muted text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        ))}
      </div>

      {/* 3. Key Metrics Cards (Optimized Design) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Revenue Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/5 to-transparent bg-surface-dark border border-border-dark rounded-3xl p-6">
           <div className="flex justify-between items-start mb-4">
              <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                 <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                 +12.5% <span className="material-symbols-outlined text-[14px]">trending_up</span>
              </span>
           </div>
           <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">Tổng Doanh Thu</p>
           <h3 className="text-3xl font-black text-text-main tracking-tight">{fmt(1250000000)}</h3>
           <p className="text-text-muted text-xs mt-2">Mục tiêu tháng: <span className="text-text-main font-bold">85%</span></p>
           <div className="w-full h-1.5 bg-background-dark rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-emerald-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
           </div>
        </div>

        {/* Orders Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-transparent bg-surface-dark border border-border-dark rounded-3xl p-6">
           <div className="flex justify-between items-start mb-4">
              <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                 <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg">
                 +5.2% <span className="material-symbols-outlined text-[14px]">trending_up</span>
              </span>
           </div>
           <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">Tổng Đơn Hàng</p>
           <h3 className="text-3xl font-black text-text-main tracking-tight">1,245</h3>
           <div className="flex justify-between items-end mt-2">
              <div className="text-xs text-text-muted">
                 <p>Thành công: <span className="text-text-main font-bold">1,100</span></p>
                 <p>Hoàn trả: <span className="text-red-500 font-bold">45</span> (3.6%)</p>
              </div>
           </div>
        </div>

        {/* Customers/Conversion Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/5 to-transparent bg-surface-dark border border-border-dark rounded-3xl p-6">
           <div className="flex justify-between items-start mb-4">
              <div className="size-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                 <span className="material-symbols-outlined text-2xl">group</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-purple-500 bg-purple-500/10 px-2 py-1 rounded-lg">
                 3.2% CR
              </span>
           </div>
           <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">Khách Hàng & Chuyển Đổi</p>
           <h3 className="text-3xl font-black text-text-main tracking-tight">15,402 <span className="text-sm font-medium text-text-muted">visits</span></h3>
           <p className="text-text-muted text-xs mt-2">Khách mới: <span className="text-text-main font-bold">328</span> (Cao nhất tuần)</p>
        </div>
      </div>

      {/* 4. Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 bg-surface-dark border border-border-dark rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-text-main">Xu hướng bán hàng</h3>
              <p className="text-xs text-text-muted">So sánh doanh thu tuần này vs tuần trước</p>
            </div>
            <select className="bg-background-dark border border-border-dark text-text-main text-xs font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer">
              <option>7 ngày qua</option>
              <option>Tháng này</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" name="Tuần này" dataKey="current" stroke="#DC2626" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" />
                <Area type="monotone" name="Tuần trước" dataKey="previous" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources & Alerts */}
        <div className="flex flex-col gap-6">

            {/* Traffic Source Donut */}
            <div className="bg-surface-dark border border-border-dark rounded-3xl p-6 shadow-sm flex-1">
                <h3 className="text-lg font-bold text-text-main mb-4">Nguồn truy cập</h3>
                <div className="flex items-center gap-4">
                    <div className="size-32 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={trafficSource} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                    {trafficSource.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-xs font-bold text-text-muted">Direct</span>
                            <span className="text-lg font-black text-text-main">15%</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        {trafficSource.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-text-muted">{item.name}</span>
                                </div>
                                <span className="font-bold text-text-main">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Low Stock Alert Widget */}
            <div className="bg-surface-dark border border-border-dark rounded-3xl p-6 shadow-sm flex-1">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500 text-lg">warning</span>
                        Cảnh báo tồn kho
                    </h3>
                    <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2">Xem tất cả</Button>
                </div>
                <div className="space-y-3">
                    {[
                        { name: 'RTX 4090 OC', stock: 2, img: 'https://picsum.photos/50?random=1' },
                        { name: 'Keychron Q1 Pro', stock: 0, img: 'https://picsum.photos/50?random=2' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-background-dark border border-border-dark">
                            <img src={item.img} className="size-10 rounded-lg object-cover" alt="" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-text-main truncate">{item.name}</p>
                                <p className="text-[10px] text-text-muted">Kho: <span className={item.stock === 0 ? 'text-red-500 font-bold' : 'text-orange-500 font-bold'}>{item.stock}</span></p>
                            </div>
                            <Button size="sm" variant="secondary" className="h-7 text-[10px] px-2">Nhập</Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
