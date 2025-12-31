import React from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';

const WaitingPayment: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  // Mock order data - in real app this would come from URL params or context
  const mockOrder = {
    id: 'ORD-001',
    total: 2500000,
    items: [
      { name: 'Gaming Laptop RTX 4060', quantity: 1, price: 2500000 }
    ]
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-[800px]">
        <div className="text-center mb-8">
          <div className="size-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-500/20">
            <span className="material-symbols-outlined text-4xl text-emerald-500">check_circle</span>
          </div>
          <h1 className="text-3xl font-black text-text-main tracking-tight mb-4">{t('checkout.orderSuccess')}</h1>
          <p className="text-text-muted">{t('checkout.successMessage', { defaultValue: 'Cảm ơn bạn đã đặt hàng. Vui lòng hoàn tất thanh toán.' })}</p>
        </div>

        <div className="bg-surface border border-border rounded-3xl p-8 space-y-6">
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-bold text-text-main mb-4">{t('checkout.orderInfo', { defaultValue: 'Thông tin đơn hàng' })}</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-muted">{t('order.orderNumber')}:</span>
                <span className="font-bold text-text-main">{mockOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">{t('cart.total')}:</span>
                <span className="font-bold text-primary">{mockOrder.total.toLocaleString()}₫</span>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div>
            <h3 className="text-lg font-bold text-text-main mb-4">{t('checkout.payment.title', { defaultValue: 'Chọn phương thức thanh toán' })}</h3>
            <div className="space-y-3">
              <button className="w-full p-4 border border-primary bg-primary/5 rounded-xl text-left hover:bg-primary/10 transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">qr_code_2</span>
                  <div>
                    <p className="font-bold text-text-main">{t('checkout.payment.vnPayWallet', { defaultValue: 'Ví VNPay' })}</p>
                    <p className="text-sm text-text-muted">{t('checkout.payment.vnPayWalletDesc', { defaultValue: 'Thanh toán nhanh qua ứng dụng VNPay' })}</p>
                  </div>
                </div>
              </button>

              <button className="w-full p-4 border border-border bg-background rounded-xl text-left hover:border-primary transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-text-muted">credit_card</span>
                  <div>
                    <p className="font-bold text-text-main">{t('checkout.payment.cardPayment', { defaultValue: 'Thẻ ATM/Visa/Master' })}</p>
                    <p className="text-sm text-text-muted">{t('checkout.payment.cardPaymentDesc', { defaultValue: 'Thanh toán qua cổng VNPay' })}</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex-1"
            >
              {t('checkout.backToHome', { defaultValue: 'Về trang chủ' })}
            </Button>
            <Button
              onClick={() => router.push(`/tracking/${mockOrder.id.replace('ORD-', '')}`)}
              className="flex-1"
            >
              {t('order.tracking', { defaultValue: 'Theo dõi đơn hàng' })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingPayment;
