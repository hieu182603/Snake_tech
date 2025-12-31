'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { orderService } from '@/services/orderService';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TrackingDetailPage() {
  const { t } = useTranslation();
  const params = useParams() as { id?: string };
  const id = params?.id || '';
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [shipperInfo, setShipperInfo] = useState<any>(null);

  const generateSteps = (orderData: any) => {
    const orderDate = new Date(orderData.orderDate || Date.now());
    const status = orderData.status || 'PENDING';
    const allSteps = [
      { key: 'PENDING', title: 'Đơn hàng đã được đặt', desc: 'Đơn hàng của bạn đã được tiếp nhận' },
      { key: 'ASSIGNED', title: 'Đã phân công shipper', desc: 'Đơn hàng đã được phân công' },
      { key: 'CONFIRMED', title: 'Đã xác nhận', desc: 'Shipper đã xác nhận nhận đơn' },
      { key: 'SHIPPING', title: 'Đang giao hàng', desc: 'Shipper đang giao hàng' },
      { key: 'DELIVERED', title: 'Đã giao hàng', desc: 'Giao thành công' },
    ];
    const statusOrder = ['PENDING', 'ASSIGNED', 'CONFIRMED', 'SHIPPING', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(status);
    return allSteps.map((s, idx) => ({
      ...s,
      status: idx < currentIndex ? 'completed' : idx === currentIndex ? 'current' : 'pending',
      date: idx <= currentIndex ? orderDate.toLocaleDateString('vi-VN') : ''
    }));
  };

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = (await orderService.getOrderById(id)) as any;
        const data = res?.data?.order || res?.order || res?.data || res;
        if (data) {
          setOrder(data);
          setSteps(generateSteps(data));
          if (data.shipper) {
            setShipperInfo({
              name: data.shipper.name || data.shipper.username,
              phone: data.shipper.phone,
              company: 'Snake Tech Shipping',
              code: (data.id || id).substring(0, 8).toUpperCase()
            });
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 max-w-[1000px]"><div className="flex items-center justify-center min-h-[300px]"><div>{t('tracking.loading', { defaultValue: 'Loading...' })}</div></div></div>;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-[1000px]">
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-slate-600 mb-4 block">inventory_2</span>
          <h2 className="text-2xl font-bold text-white mb-2">{t('tracking.notFoundTitle', { defaultValue: 'Order not found' })}</h2>
          <p className="text-slate-400 mb-6">{t('tracking.notFoundMessage', { defaultValue: 'The order you are looking for does not exist.' })}</p>
          <Link href="/order-history"><Button>{t('tracking.backToHistory', { defaultValue: 'Back to Order History' })}</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-[1000px]">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/order-history" className="size-10 rounded-xl bg-surface-dark border border-border-dark flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">{t('tracking.title', { defaultValue: 'Track Order' })}</h1>
          <p className="text-slate-400 text-sm">{t('tracking.orderCodeLabel', { defaultValue: 'Order code:' })} <span className="text-primary font-bold">{id || order.id}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-surface-dark border border-border-dark rounded-3xl p-8">
            <div className="space-y-8">
              {steps.map((step, idx) => (
                <div key={`step-${idx}`} className="relative flex gap-6">
                  {idx !== steps.length - 1 && <div className={`absolute left-[19px] top-10 bottom-[-32px] w-0.5 ${step.status === 'completed' ? 'bg-primary' : 'bg-border-dark'}`} />}
                  <div className={`size-10 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${step.status === 'completed' ? 'bg-primary border-primary text-white' : step.status === 'current' ? 'bg-primary/20 border-primary text-primary' : 'bg-background-dark border-border-dark text-slate-600'}`}>
                    <span className="material-symbols-outlined text-[20px]">{step.status === 'completed' ? 'check' : step.status === 'current' ? 'local_shipping' : 'circle'}</span>
                  </div>
                  <div className="pt-1">
                    <h4 className={`font-bold text-sm ${step.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>{step.title}</h4>
                    <p className="text-[11px] text-slate-500 font-bold mb-1">{step.date}</p>
                    <p className="text-sm text-slate-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-surface-dark border border-border-dark rounded-3xl p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person_pin</span>
              Thông tin vận chuyển
            </h3>
            {shipperInfo ? (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-12 rounded-full bg-background-dark border border-border-dark flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400">local_shipping</span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{shipperInfo.company}</p>
                    <p className="text-xs text-slate-500 font-mono">{shipperInfo.code}</p>
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-border-dark">
                  <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Shipper</span><span className="text-sm font-bold text-white">{shipperInfo.name}</span></div>
                  <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Liên hệ</span><span className="text-sm font-bold text-white">{shipperInfo.phone}</span></div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <span className="material-symbols-outlined text-3xl mb-2 block">local_shipping</span>
                <p className="text-sm">{t('tracking.noShipper', { defaultValue: 'No shipper information yet' })}</p>
              </div>
            )}
            <div className="mt-6 flex gap-2">
              <Button className="flex-1" size="sm" variant="secondary" icon="call">{t('tracking.callNow', { defaultValue: 'Call now' })}</Button>
              <Button className="flex-1" size="sm" variant="outline" icon="chat">{t('tracking.chat', { defaultValue: 'Chat' })}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
