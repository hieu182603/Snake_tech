 'use client';
 
import React, { useState, useEffect } from 'react';
import { FileText, RefreshCw, TrendingUp, DollarSign, Users, Package } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
 import {
   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
   LineChart, Line, AreaChart, Area, ComposedChart, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
 } from 'recharts';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';

// Types
interface Report {
  id?: string;
  name: string;
  type: 'SALES' | 'INVENTORY' | 'CUSTOMERS' | 'FINANCIAL';
  description: string;
  generatedAt: string;
  period: string;
  size?: string;
  downloadUrl?: string;
}

// --- MOCK DATA ---
 // 1. Revenue Data
 const financialData = [
   { date: '01/11', revenue: 45000000, profitMargin: 25, orders: 15 },
   { date: '05/11', revenue: 58000000, profitMargin: 28, orders: 22 },
   { date: '10/11', revenue: 42000000, profitMargin: 22, orders: 18 },
   { date: '15/11', revenue: 85000000, profitMargin: 30, orders: 45 },
   { date: '20/11', revenue: 65000000, profitMargin: 26, orders: 30 },
   { date: '25/11', revenue: 92000000, profitMargin: 32, orders: 52 },
   { date: '30/11', revenue: 78000000, profitMargin: 29, orders: 40 },
 ];
 
 const paymentMethods = [
   { name: 'Chuyển khoản (QR)', value: 45, color: '#3B82F6' },
   { name: 'COD', value: 30, color: '#10B981' },
   { name: 'Thẻ tín dụng', value: 15, color: '#8B5CF6' },
   { name: 'Trả góp', value: 10, color: '#F59E0B' },
 ];
 
 // 2. Product Data
 const categoryHealth = [
   { name: 'Laptop', sales: 850, returns: 12 },
   { name: 'PC Parts', sales: 1200, returns: 45 },
   { name: 'Màn hình', sales: 450, returns: 28 },
   { name: 'Gear', sales: 2100, returns: 80 },
   { name: 'Phụ kiện', sales: 3000, returns: 150 },
 ];
 
 const topProducts = [
   { id: 1, name: 'ASUS ROG Strix G16', category: 'Laptop', sold: 124, revenue: 5704000000, image: 'https://picsum.photos/50?random=1' },
   { id: 2, name: 'RTX 4090 Gaming OC', category: 'Linh kiện', sold: 85, revenue: 3527500000, image: 'https://picsum.photos/50?random=2' },
   { id: 3, name: 'MacBook Air M2 2023', category: 'Laptop', sold: 210, revenue: 5667900000, image: 'https://picsum.photos/50?random=3' },
   { id: 4, name: 'Keychron Q1 Pro', category: 'Gear', sold: 340, revenue: 1428000000, image: 'https://picsum.photos/50?random=4' },
   { id: 5, name: 'LG UltraGear 27"', category: 'Màn hình', sold: 156, revenue: 1404000000, image: 'https://picsum.photos/50?random=5' },
 ];
 
 const inventoryRisk = [
   { id: 1, name: 'Keychron Q1 Pro', sku: 'KB-9921', stock: 2, status: 'Sắp hết' },
   { id: 2, name: 'Razer DeathAdder V3', sku: 'MS-8812', stock: 0, status: 'Hết hàng' },
   { id: 3, name: 'Samsung 990 Pro 1TB', sku: 'SSD-1120', stock: 5, status: 'Sắp hết' },
   { id: 4, name: 'Dell XPS 15 9530', sku: 'LT-DELL-01', stock: 1, status: 'Sắp hết' },
   { id: 5, name: 'Corsair RM1000x', sku: 'PSU-COR-01', stock: 150, status: 'Tồn nhiều' },
 ];
 
 // 3. Customer Data
 const customerSegments = [
   { subject: 'Gamers', A: 120, fullMark: 150 },
   { subject: 'Designers', A: 98, fullMark: 150 },
   { subject: 'Students', A: 86, fullMark: 150 },
   { subject: 'Office', A: 99, fullMark: 150 },
   { subject: 'Devs', A: 85, fullMark: 150 },
   { subject: 'Enterprise', A: 65, fullMark: 150 },
 ];
 
 const geoDistribution = [
   { name: 'TP.HCM', value: 45 },
   { name: 'Hà Nội', value: 30 },
   { name: 'Đà Nẵng', value: 10 },
   { name: 'Bình Dương', value: 8 },
   { name: 'Khác', value: 7 },
 ];
 
 const topCustomers = [
   { rank: 1, name: 'Nguyễn Văn Hùng', email: 'hung.nv@gmail.com', spent: 125000000, orders: 12, lastOrder: '2 giờ trước' },
   { rank: 2, name: 'Trần Thị Lan', email: 'lan.tt@yahoo.com', spent: 89500000, orders: 8, lastOrder: '1 ngày trước' },
   { rank: 3, name: 'Cty TNHH Công Nghệ Việt', email: 'purchase@viettech.vn', spent: 450000000, orders: 5, lastOrder: '3 ngày trước' },
   { rank: 4, name: 'Lê Minh Anh', email: 'anh.lm@outlook.com', spent: 65200000, orders: 6, lastOrder: '5 ngày trước' },
   { rank: 5, name: 'Phạm Đức Duy', email: 'duy.pd@gmail.com', spent: 42000000, orders: 4, lastOrder: '1 tuần trước' },
 ];
 
 export default function AdminReportsPage() {
   const [activeTab, setActiveTab] = useState<'revenue' | 'products' | 'customers'>('revenue');
   const [dateFilter, setDateFilter] = useState('month');
  const { t } = useTranslation();

  const [reports, setReports] = useState<Report[]>([
    {
      id: 'sales-current-month',
      name: 'Báo cáo doanh thu tháng hiện tại',
      type: 'SALES',
      description: 'Báo cáo chi tiết doanh thu và đơn hàng tháng này',
      generatedAt: new Date().toISOString(),
      period: new Date().toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
      size: '2.3 MB'
    },
    {
      id: 'inventory-status',
      name: 'Báo cáo tồn kho',
      type: 'INVENTORY',
      description: 'Trạng thái tồn kho và sản phẩm sắp hết',
      generatedAt: new Date().toISOString(),
      period: 'Hiện tại',
      size: '1.8 MB'
    }
  ]);

  useEffect(() => {
    // placeholder for future loadReports
  }, []);
 
   const fmt = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num);
   const fmtCompact = (num: number) => new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(num);
 
  const getReportTypeDisplayName = (type: string) => {
    switch (type) {
      case 'SALES': return 'Báo cáo bán hàng';
      case 'INVENTORY': return 'Báo cáo tồn kho';
      case 'CUSTOMERS': return 'Báo cáo khách hàng';
      case 'FINANCIAL': return 'Báo cáo tài chính';
      default: return type;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'SALES': return 'bg-green-100 text-green-800';
      case 'INVENTORY': return 'bg-blue-100 text-blue-800';
      case 'CUSTOMERS': return 'bg-purple-100 text-purple-800';
      case 'FINANCIAL': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'SALES': return <DollarSign className="h-5 w-5" />;
      case 'INVENTORY': return <Package className="h-5 w-5" />;
      case 'CUSTOMERS': return <Users className="h-5 w-5" />;
      case 'FINANCIAL': return <TrendingUp className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };
 
   return (
     <div className="space-y-8 pb-12">
       {/* Header & Controls */}
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-surface-dark border border-border-dark p-6 rounded-3xl shadow-sm">
         <div>
           <h1 className="text-3xl font-black text-text-main tracking-tight">Báo Cáo Hoạt Động</h1>
           <p className="text-text-muted text-sm mt-1">Dữ liệu phân tích thời gian thực</p>
         </div>
 
         <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
           <select
             value={dateFilter}
             onChange={(e) => setDateFilter(e.target.value)}
             className="h-10 bg-background-dark border border-border-dark rounded-xl px-4 text-sm font-bold text-text-main focus:border-primary outline-none cursor-pointer"
           >
             <option value="week">7 ngày qua</option>
             <option value="month">Tháng này</option>
             <option value="quarter">Quý này</option>
             <option value="year">Năm nay</option>
           </select>
 
           <div className="flex bg-background-dark border border-border-dark rounded-xl p-1">
             {['revenue', 'products', 'customers'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                   activeTab === tab
                     ? 'bg-primary text-white shadow-md'
                     : 'text-text-muted hover:text-text-main hover:bg-surface-accent'
                 }`}
               >
                 {tab === 'revenue' ? 'Tài chính' : tab === 'products' ? 'Hàng hóa' : 'Khách hàng'}
               </button>
             ))}
           </div>
         </div>
       </div>
 
       {/* --- TAB 1: REVENUE & FINANCE --- */}
       {activeTab === 'revenue' && (
         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
           {/* KPI Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-surface-dark border border-border-dark p-5 rounded-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <span className="material-symbols-outlined text-4xl text-emerald-500">payments</span>
               </div>
               <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Doanh thu thuần</p>
               <h3 className="text-2xl font-black text-text-main mt-1">{fmt(1850000000)}</h3>
               <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
                 <span className="material-symbols-outlined text-sm">trending_up</span> +12.5% so với tháng trước
               </p>
             </div>
             <div className="bg-surface-dark border border-border-dark p-5 rounded-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <span className="material-symbols-outlined text-4xl text-blue-500">account_balance_wallet</span>
               </div>
               <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Lợi nhuận gộp</p>
               <h3 className="text-2xl font-black text-blue-500 mt-1">{fmt(425000000)}</h3>
               <p className="text-[10px] text-text-muted mt-2">Margin trung bình: <span className="text-text-main font-bold">23%</span></p>
             </div>
             <div className="bg-surface-dark border border-border-dark p-5 rounded-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <span className="material-symbols-outlined text-4xl text-red-500">local_shipping</span>
               </div>
               <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Chi phí vận hành</p>
               <h3 className="text-2xl font-black text-text-main mt-1">{fmt(85000000)}</h3>
               <p className="text-[10px] text-red-500 font-bold mt-2">Chiếm 4.5% doanh thu</p>
             </div>
             <div className="bg-surface-dark border border-border-dark p-5 rounded-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <span className="material-symbols-outlined text-4xl text-yellow-500">shopping_cart</span>
               </div>
               <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Giá trị đơn TB (AOV)</p>
               <h3 className="text-2xl font-black text-text-main mt-1">{fmt(2450000)}</h3>
               <p className="text-[10px] text-emerald-500 font-bold mt-2">+5% nhờ Cross-sell</p>
             </div>
           </div>
 
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Main Chart: Revenue & Margin */}
             <div className="lg:col-span-2 bg-surface-dark border border-border-dark rounded-3xl p-6 h-[400px]">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-text-main flex items-center gap-2">
                   <span className="w-1 h-6 bg-primary rounded-full"></span>
                   Biểu đồ Doanh thu & Lợi nhuận
                 </h3>
               </div>
               <ResponsiveContainer width="100%" height="100%">
                 <ComposedChart data={financialData}>
                   <defs>
                     <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                   <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                   <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={(val) => fmtCompact(val)} />
                   <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} unit="%" />
                   <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '12px' }} formatter={(value: any, name?: string) => [name === 'profitMargin' ? `${value}%` : fmt(value), name === 'profitMargin' ? 'Biên lợi nhuận' : 'Doanh thu']} />
                   <Legend wrapperStyle={{ paddingTop: '20px' }} />
                   <Bar yAxisId="left" dataKey="revenue" name="Doanh thu" fill="url(#colorRev)" barSize={30} radius={[4, 4, 0, 0]} />
                   <Line yAxisId="right" type="monotone" dataKey="profitMargin" name="Biên lợi nhuận" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                 </ComposedChart>
               </ResponsiveContainer>
             </div>
 
             {/* Secondary Chart: Payment Methods */}
             <div className="bg-surface-dark border border-border-dark rounded-3xl p-6 h-[400px] flex flex-col">
               <h3 className="font-bold text-text-main mb-2">Kênh thanh toán</h3>
               <div className="flex-1 relative">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={paymentMethods} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                       {paymentMethods.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Pie>
                     <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-3xl font-black text-text-main">4</span>
                   <span className="text-xs text-text-muted uppercase">Phương thức</span>
                 </div>
               </div>
               <div className="space-y-3 mt-4">
                 {paymentMethods.map((item, i) => (
                   <div key={i} className="flex items-center justify-between text-sm">
                     <div className="flex items-center gap-2">
                       <div className="size-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                       <span className="text-text-muted">{item.name}</span>
                     </div>
                     <span className="font-bold text-text-main">{item.value}%</span>
                   </div>
                 ))}
               </div>
             </div>
           </div>
         </div>
       )}
 

        {/* Reports List */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Báo cáo đã tạo</h2>

          {reports.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="mx-auto h-24 w-24 text-slate-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Chưa có báo cáo nào</h3>
              <p className="text-slate-400 mb-6">
                Tạo báo cáo đầu tiên của bạn bằng cách sử dụng các tùy chọn ở trên
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reports.map((report, index) => (
                <div
                  key={report.id || report.name || `report-${index}`}
                  className="bg-surface-dark border border-border-dark rounded-2xl p-6 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        {getReportTypeIcon(report.type)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{report.name}</h3>
                        <p className="text-slate-400 text-sm">{report.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge className={getReportTypeColor(report.type)}>
                            {getReportTypeDisplayName(report.type)}
                          </Badge>
                          <span className="text-slate-400 text-sm">
                            Kỳ: {report.period}
                          </span>
                          {report.size && (
                            <span className="text-slate-400 text-sm">
                              Kích thước: {report.size}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm text-slate-400">
                        <div>Tạo: {new Date(report.generatedAt).toLocaleDateString('vi-VN')}</div>
                        <div>{new Date(report.generatedAt).toLocaleTimeString('vi-VN')}</div>
                      </div>

                      {report.downloadUrl && (
                        <Button variant="outline">
                          Tải xuống
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  )
}