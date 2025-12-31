import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authService } from '@/services/authService';
import { useTranslation } from '@/hooks/useTranslation';

// Mock data structure matching Profile
interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  detail: string;
  isDefault: boolean;
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [addresses] = useState<Address[]>([]);

  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>('new');
  const [paymentMethod, setPaymentMethod] = useState('vnpay');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });

  // Mock cart data - will be replaced with actual cart context
  const mockCart = {
    items: [
      { id: '1', name: 'Sample Product', price: 1000000, quantity: 1 },
    ],
    totalAmount: 1000000,
  };

  // Prefill user info when available
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // TODO: Replace with actual auth service call
        const user = await authService.getUser();
        if (user) {
          setFormData(prev => ({
            ...prev,
            name: user.name || user.username || prev.name,
            phone: user.phone || prev.phone
          }));
        }
      } catch (error) {
        console.error('Cannot prefill profile info:', error);
      }
    };
    loadProfile();
  }, []);

  // Effect to populate form when address changes
  useEffect(() => {
    if (selectedAddressId === 'new') {
      setFormData(prev => ({ ...prev, name: '', phone: '', address: '' }));
    } else {
      const addr = addresses.find(a => a.id === selectedAddressId);
      if (addr) {
        setFormData(prev => ({
          ...prev,
          name: addr.recipientName,
          phone: addr.phone,
          address: addr.detail
        }));
      }
    }
  }, [selectedAddressId, addresses]);

  const handlePlaceOrder = () => {
    // TODO: Implement order placement logic
    console.log('Placing order with:', {
      address: formData,
      paymentMethod,
      cart: mockCart
    });

    // Navigate to waiting payment or order success page
    router.push('/waiting-payment');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-[1440px]">
      <h1 className="text-3xl font-black text-text-main mb-8 tracking-tight">{t('checkout.title')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">

          {/* Address Selection Section */}
          <section className="bg-surface border border-border rounded-3xl p-8">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-text-main flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary">location_on</span>
                 {t('checkout.shipping')}
               </h3>
               <Link href="/profile" className="text-xs font-bold text-primary hover:underline">{t('checkout.manageAddresses')}</Link>
            </div>

             {/* Horizontal Scroll / Grid for Address Cards */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all relative ${
                      selectedAddressId === addr.id
                      ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(220,38,38,0.15)]'
                      : 'bg-background border-border hover:border-slate-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-xs font-black uppercase tracking-wider ${selectedAddressId === addr.id ? 'text-primary' : 'text-text-muted'}`}>
                         {addr.label}
                       </span>
                       {selectedAddressId === addr.id && <span className="material-symbols-outlined text-primary text-xl">check_circle</span>}
                    </div>
                    <p className="font-bold text-text-main text-sm mb-1">{addr.recipientName} - {addr.phone}</p>
                    <p className="text-xs text-text-muted line-clamp-2">{addr.detail}</p>
                  </div>
                ))}

                {/* Option for New Address */}
                <div
                   onClick={() => setSelectedAddressId('new')}
                   className={`cursor-pointer rounded-2xl border border-dashed p-4 flex flex-col items-center justify-center gap-2 transition-all ${
                     selectedAddressId === 'new'
                     ? 'bg-white/5 border-white text-text-main'
                     : 'bg-transparent border-border text-text-muted hover:text-text-main hover:border-slate-400'
                   }`}
                >
                   <span className="material-symbols-outlined text-2xl">add_location_alt</span>
                   <span className="text-xs font-bold uppercase">{t('checkout.enterOtherAddress')}</span>
                </div>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-background border border-border rounded-xl px-4 py-3 text-text-main placeholder-text-muted focus:ring-1 focus:ring-primary outline-none"
                placeholder={t('checkout.form.name')}
              />
              <input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="bg-background border border-border rounded-xl px-4 py-3 text-text-main placeholder-text-muted focus:ring-1 focus:ring-primary outline-none"
                placeholder={t('checkout.form.phone')}
              />
              <input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="md:col-span-2 bg-background border border-border rounded-xl px-4 py-3 text-text-main placeholder-text-muted focus:ring-1 focus:ring-primary outline-none"
                placeholder={t('checkout.form.address')}
              />
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                className="md:col-span-2 bg-background border border-border rounded-xl px-4 py-3 text-text-main placeholder-text-muted focus:ring-1 focus:ring-primary outline-none h-24"
                placeholder={t('checkout.form.note')}
              ></textarea>
            </div>
          </section>

          <section className="bg-surface border border-border rounded-3xl p-8">
            <h3 className="text-xl font-bold text-text-main mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">payments</span>
              {t('checkout.payment')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'vnpay', name: t('payment.vnPayWallet', { defaultValue: 'Ví VNPay' }), icon: 'qr_code_2' },
                { id: 'card', name: t('payment.cardPayment', { defaultValue: 'Thẻ ATM' }), icon: 'credit_card' },
                { id: 'cod', name: t('payment.cod', { defaultValue: 'COD' }), icon: 'handshake' }
              ].map(p => (
                <div
                  key={p.id}
                  onClick={() => setPaymentMethod(p.id)}
                  className={`border rounded-2xl p-4 flex flex-col items-center gap-3 cursor-pointer transition-all group ${
                    paymentMethod === p.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background/50 hover:border-primary'
                  }`}
                >
                  <span className={`material-symbols-outlined text-3xl ${paymentMethod === p.id ? 'text-primary' : 'text-text-muted group-hover:text-primary'}`}>
                    {p.icon}
                  </span>
                  <span className={`text-sm font-bold ${paymentMethod === p.id ? 'text-text-main' : 'text-text-muted group-hover:text-text-main'}`}>
                    {t(`payment.${p.id}`, { defaultValue: p.name })}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-surface border border-border rounded-3xl p-8 sticky top-24">
            <h3 className="text-xl font-bold text-text-main mb-6 border-b border-border pb-4">{t('checkout.review')}</h3>

            {/* Cart Items Summary */}
            <div className="space-y-3 mb-6">
              {mockCart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">{item.name} × {item.quantity}</span>
                  <span className="text-text-main font-bold">{item.price.toLocaleString('vi-VN')}₫</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-6 border-t border-border pt-4">
            <div className="flex justify-between text-text-muted"><span>{t('checkout.subtotal')}</span><span className="text-text-main font-bold">{mockCart.totalAmount.toLocaleString('vi-VN')}₫</span></div>
            <div className="flex justify-between text-text-muted"><span>{t('checkout.shipping')}</span><span className="text-emerald-500 font-bold">{t('checkout.free')}</span></div>
            <div className="flex justify-between text-lg font-black text-text-main pt-4 border-t border-border"><span>{t('checkout.total')}</span><span className="text-primary">{mockCart.totalAmount.toLocaleString('vi-VN')}₫</span></div>
            </div>
          <button
            onClick={handlePlaceOrder}
            disabled={mockCart.items.length === 0}
            className="w-full py-4 bg-primary text-black font-black rounded-2xl shadow-lg hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {t('checkout.placeOrder')}
          </button>
            <p className="text-[10px] text-text-muted text-center mt-4">{t('checkout.termsAgree')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
