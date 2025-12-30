import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';

const Tracking: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const [orderId, setOrderId] = useState(id as string || '');
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async () => {
    if (!orderId.trim()) return;

    setLoading(true);
    // Mock tracking data
    setTimeout(() => {
      setOrderStatus({
        id: orderId,
        status: 'SHIPPING',
        currentStep: 2,
        steps: [
          { label: 'Đã xác nhận', completed: true, date: '2024-12-30' },
          { label: 'Đang giao hàng', completed: true, date: '2024-12-31' },
          { label: 'Đã giao hàng', completed: false, date: null }
        ],
        estimatedDelivery: '2024-12-31',
        carrier: 'Giao Hàng Nhanh',
        trackingNumber: 'GHN123456789'
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-[800px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-text-main tracking-tight mb-4">{t('order.tracking')}</h1>
          <p className="text-text-muted">Theo dõi đơn hàng của bạn</p>
        </div>

        {!orderStatus ? (
          <div className="bg-surface border border-border rounded-3xl p-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-text-main mb-2">Mã đơn hàng</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-main placeholder-text-muted focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Nhập mã đơn hàng (VD: ORD-001)"
                />
              </div>
              <Button
                onClick={handleTrackOrder}
                disabled={!orderId.trim() || loading}
                className="w-full"
              >
                {loading ? 'Đang tìm...' : 'Theo dõi đơn hàng'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-surface border border-border rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-text-main">Đơn hàng {orderStatus.id}</h2>
                  <p className="text-text-muted">Dự kiến giao: {orderStatus.estimatedDelivery}</p>
                </div>
                <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold">
                  {orderStatus.status === 'SHIPPING' ? 'Đang giao hàng' : orderStatus.status}
                </div>
              </div>

              {/* Progress Steps */}
              <div className="space-y-4">
                {orderStatus.steps.map((step: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`size-10 rounded-full flex items-center justify-center border-2 ${
                      step.completed
                        ? 'bg-primary border-primary text-white'
                        : 'border-border text-text-muted'
                    }`}>
                      {step.completed ? (
                        <span className="material-symbols-outlined text-sm">check</span>
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${step.completed ? 'text-text-main' : 'text-text-muted'}`}>
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-xs text-text-muted">{step.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Carrier Info */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-1">Đơn vị vận chuyển</p>
                    <p className="text-text-main font-bold">{orderStatus.carrier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-1">Mã vận đơn</p>
                    <p className="text-text-main font-bold">{orderStatus.trackingNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setOrderStatus(null)}
              >
                Theo dõi đơn khác
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
