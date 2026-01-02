'use client';

import React, { useState, useMemo, useEffect, useContext } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/ui/Pagination';
import { AdminLayoutContext } from '../AdminLayout';
import { useTranslation } from '@/hooks/useTranslation';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

interface OrderDetail {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  total: number;
  status: string;
  color: string;
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  items: OrderItem[];
  paymentMethod?: string;
  shippingAddress?: string;
}

const ITEMS_PER_PAGE = 5;

export default function AdminOrdersPage() {
  const { t } = useTranslation();
  const context = useContext(AdminLayoutContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { isInRange } = context;
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Expandable row processing menu
  const [activeProcessId, setActiveProcessId] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const fiveDaysAgo = new Date(today); fiveDaysAgo.setDate(today.getDate() - 5);
  const lastMonth = new Date(today); lastMonth.setMonth(today.getMonth() - 1);

  const [orders, setOrders] = useState<OrderDetail[]>([
    {
      id: '#ORD-2023-001',
      customer: 'Nguyễn Văn Hùng',
      email: 'hung.nv@gmail.com',
      phone: '0901234567',
      date: formatDate(today),
      total: 52490000,
      status: 'Chờ xác nhận',
      color: 'text-yellow-500',
      variant: 'warning',
      shippingAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      paymentMethod: 'COD (Thanh toán khi nhận hàng)',
      items: [{ id: 'p1', name: 'RTX 4090 Gaming OC', price: 50000000, qty: 1, image: 'https://picsum.photos/200?random=1' }]
    },
    {
      id: '#ORD-2023-002',
      customer: 'Trần Thị Lan',
      email: 'lan.tt@yahoo.com',
      phone: '0912345678',
      date: formatDate(yesterday),
      total: 2490000,
      status: 'Đã xác nhận',
      color: 'text-blue-500',
      variant: 'info',
      shippingAddress: '456 Lê Lợi, Quận Hải Châu, Đà Nẵng',
      paymentMethod: 'Chuyển khoản ngân hàng',
      items: [{ id: 'p3', name: 'Logitech MX Master 3S', price: 2490000, qty: 1, image: 'https://picsum.photos/200?random=2' }]
    },
    {
      id: '#ORD-2023-003',
      customer: 'Phạm Minh',
      email: 'minh.p@gmail.com',
      phone: '0987654321',
      date: formatDate(fiveDaysAgo),
      total: 26990000,
      status: 'Đang giao hàng',
      color: 'text-purple-400',
      variant: 'primary',
      shippingAddress: '789 Cầu Giấy, Hà Nội',
      paymentMethod: 'Ví VNPay',
      items: [{ id: 'p4', name: 'MacBook Air M2', price: 26990000, qty: 1, image: 'https://picsum.photos/200?random=3' }]
    },
    {
      id: '#ORD-2023-004',
      customer: 'Lê Anh',
      email: 'anh.le@gmail.com',
      phone: '0933221100',
      date: formatDate(lastMonth),
      total: 4500000,
      status: 'Đã giao hàng',
      color: 'text-green-500',
      variant: 'success',
      shippingAddress: 'Khu Công Nghệ Cao, Quận 9, TP.HCM',
      paymentMethod: 'Thẻ tín dụng (Visa/Master)',
      items: [{ id: 'p5', name: 'Keychron Q1 Pro', price: 4500000, qty: 1, image: 'https://picsum.photos/200?random=4' }]
    },
    {
      id: '#ORD-2023-005',
      customer: 'Hoàng Yến',
      email: 'yen.hoang@gmail.com',
      phone: '0911223344',
      date: formatDate(today),
      total: 12000000,
      status: 'Chờ xác nhận',
      color: 'text-yellow-500',
      variant: 'warning',
      shippingAddress: 'Chung cư Masteri, Quận 2, TP.HCM',
      paymentMethod: 'COD',
      items: [{ id: 'p6', name: 'Màn hình LG UltraGear', price: 12000000, qty: 1, image: 'https://picsum.photos/200?random=5' }]
    },
  ]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesDate = isInRange(order.date);
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || order.status === filterStatus;

      return matchesDate && matchesSearch && matchesStatus;
    });
  }, [orders, isInRange, searchTerm, filterStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredOrders.length]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredOrders]);

  // Actions
  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    alert("Đang xuất dữ liệu đơn hàng ra file Excel...");
  };

  const handleProcessOrder = (id: string, currentStatus: string) => {
    // Simple state machine for demo
    const statusFlow = {
        'Chờ xác nhận': { next: 'Đã xác nhận', variant: 'info' },
        'Đã xác nhận': { next: 'Đang giao hàng', variant: 'primary' },
        'Đang giao hàng': { next: 'Đã giao hàng', variant: 'success' },
        'Đã giao hàng': { next: 'Đã giao hàng', variant: 'success' },
        'Đã hủy': { next: 'Đã hủy', variant: 'danger' }
    };

    const nextState = statusFlow[currentStatus as keyof typeof statusFlow];
    if (nextState) {
        setOrders(prev => prev.map(o =>
            o.id === id ? { ...o, status: nextState.next, variant: nextState.variant as any } : o
        ));
        // Also update selected order if open
        if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder(prev => prev ? ({ ...prev, status: nextState.next, variant: nextState.variant as any }) : null);
        }
    }
    setActiveProcessId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Quản Lý Đơn Hàng</h1>
          <p className="text-gray-400 mt-1">Theo dõi và cập nhật trạng thái đơn hàng</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon="print" onClick={() => alert("Chức năng in danh sách đang được phát triển")}>In hóa đơn</Button>
          <Button variant="primary" icon="download" onClick={handleExport}>Xuất dữ liệu</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 rounded-2xl border border border-border-dark bg-surface-dark p-5 shadow-sm items-center">
        <div className="relative flex-1 w-full md:w-auto">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border-dark bg-background-dark text-sm text-white placeholder-gray-500 focus:border-primary outline-none transition-all"
            placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <select
            className="h-11 appearance-none rounded-xl border border-border-dark bg-background-dark px-4 pl-4 text-sm text-white focus:border-primary outline-none min-w-[180px] cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Đang giao hàng">Đang giao hàng</option>
            <option value="Đã giao hàng">Đã giao hàng</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-border-dark bg-surface-dark shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#1a1a1a] text-xs uppercase tracking-wider text-slate-400 border-b border-border-dark">
              <tr>
                <th className="px-6 py-5 font-bold">Mã đơn hàng</th>
                <th className="px-6 py-5 font-bold">Khách hàng</th>
                <th className="px-6 py-5 font-bold">Ngày đặt</th>
                <th className="px-6 py-5 font-bold">Tổng tiền</th>
                <th className="px-6 py-5 font-bold text-center">Trạng thái</th>
                <th className="px-6 py-5 font-bold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/50">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((o, i) => (
                  <tr key={i} className="group hover:bg-white/[0.02] transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></div>
                        <span className="font-mono text-white font-bold group-hover:text-primary transition-colors">{o.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-background-dark to-surface-dark flex items-center justify-center text-xs font-black text-slate-300 border border-border-dark shadow-inner">
                          {o.customer.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-sm">{o.customer}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{o.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        <span className="text-sm font-medium">{o.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-white text-sm tracking-tight">{o.total.toLocaleString()}đ</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={o.variant}>{o.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-dark border border-border-dark text-slate-300 hover:text-white hover:border-primary transition-all text-xs font-bold"
                          title="Xem chi tiết"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          Chi tiết
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setActiveProcessId(activeProcessId === o.id ? null : o.id)}
                                className="flex items-center gap-1 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1.5 text-xs font-bold hover:bg-blue-500 hover:text-white transition-all"
                            >
                                Xử lý
                                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                            </button>
                            {activeProcessId === o.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-surface-dark border border-border-dark rounded-xl shadow-2xl z-50 overflow-hidden">
                                    <button
                                        onClick={() => handleProcessOrder(o.id, o.status)}
                                        className="w-full text-left px-4 py-3 hover:bg-white/10 text-xs text-white font-bold flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">fast_forward</span>
                                        Chuyển trạng thái tiếp theo
                                    </button>
                                    <button
                                        onClick={() => {
                                            setOrders(prev => prev.map(item => item.id === o.id ? {...item, status: 'Đã hủy', variant: 'danger'} : item));
                                            setActiveProcessId(null);
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-red-500/20 text-xs text-red-500 font-bold flex items-center gap-2 border-t border-border-dark"
                                    >
                                        <span className="material-symbols-outlined text-sm">cancel</span>
                                        Hủy đơn hàng
                                    </button>
                                </div>
                            )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="size-12 rounded-full bg-background-dark flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-600">search_off</span>
                      </div>
                      <p>Không có đơn hàng nào trong khoảng thời gian này.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Redesigned Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="Chi tiết đơn hàng"
        size="5xl"
        footer={
          <div className="flex justify-between w-full">
             <div className="text-xs text-slate-500 italic flex items-center">
                *Đơn hàng đã bao gồm VAT
             </div>
             <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>Đóng</Button>
                <Button variant="secondary" icon="print" onClick={handlePrint}>In phiếu</Button>
                <Button variant="primary" icon="check" onClick={() => selectedOrder && handleProcessOrder(selectedOrder.id, selectedOrder.status)}>
                    Cập nhật trạng thái
                </Button>
             </div>
          </div>
        }
      >
        {selectedOrder && (
          <div className="space-y-8 font-display">

            {/* 1. Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border-dark border-dashed">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-black text-white tracking-tight">{selectedOrder.id}</h2>
                        <Badge variant={selectedOrder.variant}>{selectedOrder.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-400">Ngày đặt hàng: <span className="text-white font-bold">{selectedOrder.date}</span> lúc 09:30 AM</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Tổng giá trị</p>
                    <p className="text-3xl font-black text-primary">{selectedOrder.total.toLocaleString()}đ</p>
                </div>
            </div>

            {/* 2. Customer & Shipping & Payment Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Customer */}
                <div className="bg-background-dark/50 p-5 rounded-2xl border border-border-dark">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">person</span> Khách hàng
                    </h4>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-10 rounded-full bg-surface-dark border border-border-dark flex items-center justify-center text-primary font-bold">
                            {selectedOrder.customer.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{selectedOrder.customer}</p>
                            <p className="text-xs text-slate-500">Khách hàng thân thiết</p>
                        </div>
                    </div>
                    <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-2 text-slate-400"><span className="material-symbols-outlined text-[16px]">email</span> {selectedOrder.email}</p>
                        <p className="flex items-center gap-2 text-slate-400"><span className="material-symbols-outlined text-[16px]">call</span> {selectedOrder.phone}</p>
                    </div>
                </div>

                {/* Shipping */}
                <div className="bg-background-dark/50 p-5 rounded-2xl border border-border-dark">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">local_shipping</span> Giao hàng
                    </h4>
                    <div className="mb-3">
                        <p className="text-sm font-bold text-white mb-1">Giao hàng tiêu chuẩn</p>
                        <p className="text-xs text-slate-500">Vận chuyển bởi: <span className="text-white font-bold">Giao Hàng Nhanh</span></p>
                    </div>
                    <div className="text-sm text-slate-400 leading-relaxed border-t border-border-dark/50 pt-3 mt-3">
                        <span className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Địa chỉ nhận hàng:</span>
                        {selectedOrder.shippingAddress || 'Chưa cập nhật địa chỉ'}
                    </div>
                </div>

                {/* Payment */}
                <div className="bg-background-dark/50 p-5 rounded-2xl border border-border-dark">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">credit_card</span> Thanh toán
                    </h4>
                    <div className="mb-3">
                        <p className="text-sm font-bold text-white mb-1">{selectedOrder.paymentMethod || 'Tiền mặt'}</p>
                        <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Đã kiểm tra
                        </p>
                    </div>
                    <div className="text-sm text-slate-400 leading-relaxed border-t border-border-dark/50 pt-3 mt-3">
                        <div className="flex justify-between mb-1">
                            <span>Tạm tính:</span>
                            <span className="text-white">{selectedOrder.total.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Phí ship:</span>
                            <span className="text-emerald-500 font-bold">0đ</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Items Table */}
            <div>
                <h4 className="text-sm font-bold text-white mb-4">Danh sách sản phẩm</h4>
                <div className="bg-background-dark/30 border border-border-dark rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-surface-dark text-xs uppercase text-slate-500 font-bold border-b border-border-dark">
                            <tr>
                                <th className="px-6 py-4">Sản phẩm</th>
                                <th className="px-6 py-4 text-center">Đơn giá</th>
                                <th className="px-6 py-4 text-center">Số lượng</th>
                                <th className="px-6 py-4 text-right">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark/50">
                            {selectedOrder.items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.02]">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-lg bg-surface-dark border border-border-dark flex items-center justify-center overflow-hidden shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-slate-600">image</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-slate-500">Mã: {item.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-300">
                                        {item.price.toLocaleString()}đ
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-white">
                                        x{item.qty}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-primary">
                                        {(item.price * item.qty).toLocaleString()}đ
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-surface-dark/50 border-t border-border-dark">
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-right font-bold text-slate-400 uppercase text-xs tracking-wider">Tổng cộng</td>
                                <td className="px-6 py-4 text-right font-black text-xl text-white">
                                    {selectedOrder.total.toLocaleString()}đ
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
}