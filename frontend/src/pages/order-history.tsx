import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
  shippingFee: number;
  discount: number;
}

const OrderHistory: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);

        // Mock orders data
        const mockOrders: Order[] = [
          {
            id: '#ORD-001',
            date: new Date().toLocaleDateString('vi-VN'),
            total: 2500000,
            status: t('order.history.status.DELIVERED'),
            variant: 'success',
            items: [
              {
                id: '1',
                name: 'Gaming Laptop RTX 4060',
                price: 2500000,
                qty: 1,
                image: 'https://picsum.photos/200/200?random=laptop'
              }
            ],
            shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
            paymentMethod: 'VNPay',
            shippingFee: 0,
            discount: 0
          },
          {
            id: '#ORD-002',
            date: new Date(Date.now() - 86400000).toLocaleDateString('vi-VN'),
            total: 1500000,
            status: t('order.history.status.SHIPPING'),
            variant: 'warning',
            items: [
              {
                id: '2',
                name: 'Mechanical Keyboard RGB',
                price: 800000,
                qty: 1,
                image: 'https://picsum.photos/200/200?random=keyboard'
              },
              {
                id: '3',
                name: 'Gaming Mouse',
                price: 700000,
                qty: 1,
                image: 'https://picsum.photos/200/200?random=mouse'
              }
            ],
            shippingAddress: '456 Đường XYZ, Quận 7, TP.HCM',
            paymentMethod: 'COD',
            shippingFee: 0,
            discount: 0
          }
        ];

        setOrders(mockOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [t]);

  const handleReBuy = () => {
    console.log('Reordering items from order:', selectedOrder?.id);
    // TODO: Implement reordering logic
  };

  const handleTrack = (orderId: string) => {
    setSelectedOrder(null);
    router.push(`/tracking/${orderId.replace('#', '')}`);
  };

  const getStatusColor = (variant: string) => {
    switch(variant) {
        case 'info': return 'text-blue-400 border-blue-500/30 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.2)]';
        case 'success': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
        case 'danger': return 'text-red-400 border-red-500/30 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
        default: return 'text-text-muted border-border/30 bg-border/10';
    }
  };

  const getStatusTimelineWidth = (status: string) => {
    if (status === t('order.history.status.CANCELLED')) return '100%';
    if (status === t('order.history.status.DELIVERED')) return '100%';
    if (status === t('order.history.status.SHIPPING')) return '60%';
    return '10%';
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-[1000px]">
      <h1 className="text-3xl font-black text-text-main mb-8 tracking-tight">{t('order.history.title')}</h1>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">{t('order.history.loading')}</p>
        </div>
      ) : orders.length > 0 ? (
        /* Order List */
        <div className="grid gap-6">
          {orders.map(o => (
          <div key={o.id} className="group relative bg-surface border border-border hover:border-primary/50 transition-all duration-300 rounded-3xl overflow-hidden shadow-lg">
             {/* Gradient Hover Effect */}
             <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

             {/* Header */}
             <div className="flex items-center justify-between p-6 border-b border-border bg-background/30">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted">
                    <span className="material-symbols-outlined">receipt</span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-text-main tracking-wide">{o.id}</h3>
                    <p className="text-xs text-text-muted font-medium">{o.date}</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase ${getStatusColor(o.variant)}`}>
                  {o.status}
                </div>
             </div>

             {/* Body */}
             <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Product Preview */}
                <div className="flex -space-x-3 overflow-hidden">
                   {o.items.map((item, idx) => (
                      <div key={idx} className="size-14 rounded-full border-2 border-surface bg-background relative z-10 overflow-hidden shadow-lg">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                   ))}
                   {o.items.length > 0 && (
                     <div className="flex flex-col justify-center pl-6">
                        <p className="text-sm font-bold text-text-main line-clamp-1">{o.items[0].name}</p>
                        {o.items.length > 1 && <p className="text-xs text-text-muted">{t('order.history.andMore', { count: o.items.length - 1 })}</p>}
                     </div>
                   )}
                </div>

                {/* Total & Action */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                   <div className="text-right">
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1">{t('order.history.total')}</p>
                      <p className="font-display font-black text-xl text-text-main">{o.total.toLocaleString()}đ</p>
                   </div>
                   <button
                     onClick={() => setSelectedOrder(o)}
                     className="size-10 rounded-full border border-border hover:bg-text-main hover:text-surface hover:border-text-main transition-all flex items-center justify-center text-text-muted"
                   >
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                   </button>
                </div>
             </div>
          </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-surface border border-border rounded-3xl">
          <div className="size-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
            <span className="material-symbols-outlined text-4xl text-text-muted">receipt_long</span>
          </div>
          <h3 className="text-lg font-bold text-text-main mb-2">{t('order.history.empty.title')}</h3>
          <p className="text-text-muted">{t('order.history.empty.description')}</p>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-main">{t('order.history.modal.title')}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="size-8 rounded-full border border-border hover:bg-border flex items-center justify-center text-text-muted"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8 max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* Header Section */}
              <div className="text-center pb-6 border-b border-border">
                <h2 className="text-3xl font-display font-black text-text-main tracking-tight mb-1">{selectedOrder.id}</h2>
                <p className="text-sm text-text-muted font-medium">{selectedOrder.date}</p>
                <div className="mt-6 flex flex-col items-center gap-2">
                   <div className="w-full max-w-xs h-1.5 bg-background rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${selectedOrder.status === 'ĐÃ HỦY' ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: getStatusTimelineWidth(selectedOrder.status) }}
                      ></div>
                   </div>
                   <span className={`text-xs font-black uppercase tracking-widest mt-1 ${selectedOrder.variant === 'danger' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {selectedOrder.status}
                   </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background border border-border p-5 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-text-muted mb-1">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">{t('order.history.shippedTo')}</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-text-main">Alex User</p>
                        <p className="text-xs text-text-muted leading-relaxed mt-1">{selectedOrder.shippingAddress}</p>
                    </div>
                </div>
                <div className="bg-background border border-border p-5 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-text-muted mb-1">
                        <span className="material-symbols-outlined text-[18px]">credit_card</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">{t('order.history.payment')}</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-text-main">{selectedOrder.paymentMethod}</p>
                        <p className="text-xs text-emerald-500 font-bold mt-1 flex items-center gap-1">
                           <span className="material-symbols-outlined text-[14px]">check_circle</span> {t('order.history.paid')}
                        </p>
                    </div>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-background/30 border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-white/[0.02]">
                   <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('order.history.productDetails')}</h4>
                </div>
                <div className="divide-y divide-border/50">
                    {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 hover:bg-white/[0.02] transition-colors">
                            <div className="size-16 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-text-main line-clamp-1">{item.name}</p>
                                <p className="text-xs text-text-muted mt-1">{t('order.history.quantity')}: <span className="text-text-main">x{item.qty}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-text-main">{item.price.toLocaleString()}đ</p>
                            </div>
                        </div>
                    ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex flex-col items-end space-y-3 pt-2">
                <div className="w-full md:w-1/2 space-y-3">
                    <div className="flex justify-between text-xs text-text-muted">
                        <span>{t('order.history.subtotal')}</span>
                        <span className="text-text-main font-medium">{(selectedOrder.total - selectedOrder.shippingFee + selectedOrder.discount).toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between text-xs text-text-muted">
                        <span>{t('order.history.shipping')}</span>
                        <span className="text-text-main font-medium">{selectedOrder.shippingFee.toLocaleString()}đ</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-xs text-primary">
                            <span>{t('order.history.discount')}</span>
                            <span>-{selectedOrder.discount.toLocaleString()}đ</span>
                        </div>
                    )}
                    <div className="h-px bg-border my-2"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-text-main uppercase tracking-widest">{t('order.history.grandTotal')}</span>
                        <span className="text-2xl font-display font-black text-primary">{selectedOrder.total.toLocaleString()}đ</span>
                    </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-surface">
              <div className="flex justify-end gap-3 w-full">
                 <Button variant="outline" onClick={() => setSelectedOrder(null)}>{t('order.history.modal.close')}</Button>
                 {selectedOrder?.status === t('order.history.status.DELIVERED') && (
                     <Button variant="primary" onClick={handleReBuy}>{t('order.history.modal.reorder')}</Button>
                 )}
                 {selectedOrder?.status === t('order.history.status.SHIPPING') && (
                     <Button variant="secondary" onClick={() => handleTrack(selectedOrder.id)}>{t('order.history.modal.track')}</Button>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default OrderHistory;
