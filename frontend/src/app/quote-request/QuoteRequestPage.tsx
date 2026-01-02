'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { productService } from '@/services/productService';
import { rfqService } from '@/services/rfqService';
import { useToast } from '@/contexts/ToastContext';
import { useTranslation } from '@/hooks/useTranslation';

type CategoryKey = 'CPU' | 'Mainboard' | 'RAM' | 'VGA' | 'SSD' | 'HDD' | 'PSU' | 'Case' | 'Cooling' | 'Monitor' | 'Gear';

interface ProductPart {
  id: string;
  name: string;
  price: number;
  category: CategoryKey;
  image: string;
}

interface QuoteItem extends ProductPart {
  qty: number;
}

const getCategories = (t: (k: string, opts?: any) => string) => [
  { id: 'CPU', label: t('quote.categories.cpu'), icon: 'memory', categoryName: 'cpu' },
  { id: 'Mainboard', label: t('quote.categories.motherboard'), icon: 'developer_board', categoryName: 'motherboard' },
  { id: 'RAM', label: t('quote.categories.ram'), icon: 'memory_alt', categoryName: 'ram' },
  { id: 'VGA', label: t('quote.categories.gpu'), icon: 'videogame_asset', categoryName: 'gpu' },
  { id: 'SSD', label: t('quote.categories.drive'), icon: 'storage', categoryName: 'drive' },
  { id: 'PSU', label: t('quote.categories.psu'), icon: 'power', categoryName: 'psu' },
  { id: 'Case', label: t('quote.categories.case'), icon: 'computer', categoryName: 'case' },
  { id: 'Cooling', label: t('quote.categories.cooler'), icon: 'mode_fan', categoryName: 'cooler' },
  { id: 'Monitor', label: t('quote.categories.monitor'), icon: 'monitor', categoryName: 'monitor' },
  { id: 'Gear', label: t('quote.categories.accessories'), icon: 'keyboard', categoryName: 'accessories' },
];

export default function QuoteRequestPage() {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<CategoryKey>('CPU');
  const [searchTerm, setSearchTerm] = useState('');
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [products, setProducts] = useState<ProductPart[]>([]);
  const [loading, setLoading] = useState(true);

  const CATEGORIES = useMemo(() => getCategories(t), [t]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const cat = CATEGORIES.find(c => c.id === activeCategory);
        if (!cat) return;
        const data = await productService.getProductsByCategoryName(cat.categoryName, 500);
        const transformed = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: activeCategory,
          image: p.images?.[0]?.url || 'https://picsum.photos/200/200'
        }));
        setProducts(transformed);
      } catch (e) {
        console.error(e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [activeCategory]); // Removed CATEGORIES from dependencies

  const filteredProducts = useMemo(() => products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())), [products, searchTerm]);

  const addToQuote = (p: ProductPart) => {
    setQuoteItems(prev => {
      const found = prev.find(x => x.id === p.id);
      if (found) return prev.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { ...p, qty: 1 }];
    });
  };
  const removeFromQuote = (id: string) => setQuoteItems(prev => prev.filter(i => i.id !== id));
  const updateQty = (id: string, delta: number) => setQuoteItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const totalPrice = quoteItems.reduce((s, i) => s + i.price * i.qty, 0);

  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', note: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteItems.length === 0) {
      showError(t('quote.errors.noItems'));
      return;
    }
    if (!customer.name || !customer.phone) {
      showError(t('quote.errors.missingInfo'));
      return;
    }

    try {
      // Transform quote items to RFQ format
      const rfqItems = quoteItems.map(item => ({
        productId: item.id,
        productName: item.name,
        qty: item.qty
      }));

      const rfqData = {
        items: rfqItems,
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        },
        title: `RFQ - ${customer.name} - ${new Date().toLocaleDateString()}`,
        description: customer.note || `RFQ request with ${quoteItems.length} items`,
        total: totalPrice
      };

      const result = await rfqService.createRFQ(rfqData);

      if (result.success) {
        showSuccess(t('quote.success.submitMessage', {
          total: totalPrice.toLocaleString('vi-VN'),
          count: quoteItems.length,
          name: customer.name,
          phone: customer.phone
        }));

        // Clear form
        setQuoteItems([]);
        setCustomer({ name: '', email: '', phone: '', note: '' });

        // Navigate to success page or home
        router.push('/');
      }
    } catch (error: any) {
      console.error('RFQ submission error:', error);
      showError(error.message || t('quote.errors.submitFailed'));
    }
  };

  return (
    <div className="flex flex-col bg-background-dark min-h-screen">
      <div className="bg-surface-dark border-b border-border-dark py-10 px-4 rounded-b-[32px] shadow-lg shadow-black/40 mb-10 mt-16 lg:mt-20">
        <div className="mx-auto max-w-[1200px]">
          <h1 className="text-3xl md:text-4xl font-black text-text-main tracking-tight mb-2">{t('quote.title')}</h1>
          <p className="text-text-strong max-w-2xl">{t('quote.subtitle')}</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex overflow-x-auto gap-2 pb-2">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id as CategoryKey)} className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap ${activeCategory === cat.id ? 'bg-primary text-white' : 'bg-surface-dark text-text-strong'}`}>
                  <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="bg-surface-dark border border-border-dark rounded-3xl p-6 min-h-[300px]">
              <div className="mb-6">
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t('quote.searchPlaceholder', { category: CATEGORIES.find(c => c.id === activeCategory)?.label })} className="w-full p-3 rounded-xl bg-background-dark border border-border-dark text-sm text-text-main" />
              </div>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => <div key={`skeleton-${i}`} className="h-24 bg-surface-dark rounded-2xl animate-pulse" />)}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((p, index) => (
                    <div key={`${p.category}-${p.id || 'no-id'}-${index}`} className="group flex gap-4 p-4 rounded-2xl border border-border-dark bg-background-dark/50">
                      <div className="w-20 h-20 rounded-lg overflow-hidden">
                        <img src={p.image} alt={p.name || 'product'} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-text-main text-sm">{p.name}</h4>
                        <div className="flex items-center justify-between mt-4">
                          <span className="font-bold text-text-main">{(p.price || 0).toLocaleString()}đ</span>
                          <Button size="sm" variant="secondary" icon="add" onClick={() => addToQuote(p)}>{t('quote.addButton')}</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-text-strong">
                  <p>{t('quote.noProducts')}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="sticky top-24 space-y-6">
              <div className="bg-surface-dark border border-border-dark rounded-3xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-text-main">{t('quote.selectedTitle')}</h3>
                  <span className="text-sm text-slate-400">{t('quote.selectedCount', { count: quoteItems.length })}</span>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {quoteItems.length > 0 ? quoteItems.map(item => (
                    <div key={item.id} className="flex gap-3 p-2 rounded-xl bg-background-dark/50">
                      <div className="w-12 h-12 rounded overflow-hidden">
                        <img src={item.image} alt={item.name || 'item'} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-xs font-bold text-text-main">{item.name}</p>
                          <button onClick={() => removeFromQuote(item.id)} className="text-slate-400">✕</button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQty(item.id, -1)} className="px-2">-</button>
                          <span className="text-sm">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="px-2">+</button>
                        </div>
                      </div>
                    </div>
                  )) : <div className="py-6 text-center text-slate-500">{t('quote.emptySelection')}</div>}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-slate-400">{t('quote.totalLabel')}</span>
                  <span className="text-xl font-black text-text-main">{(totalPrice || 0).toLocaleString()}đ</span>
                </div>
              </div>

              <div className="bg-surface-dark border border-border-dark rounded-3xl p-6">
                <h4 className="text-sm font-black text-text-main mb-3">{t('quote.form.title')}</h4>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input placeholder={t('quote.form.namePlaceholder')} value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} className="w-full p-3 rounded-xl bg-background-dark border border-border-dark text-sm" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder={t('quote.form.phonePlaceholder')} value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} className="p-3 rounded-xl bg-background-dark border border-border-dark text-sm" />
                    <input placeholder={t('quote.form.emailPlaceholder')} value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} className="p-3 rounded-xl bg-background-dark border border-border-dark text-sm" />
                  </div>
                  <textarea placeholder={t('quote.form.notePlaceholder')} value={customer.note} onChange={(e) => setCustomer({ ...customer, note: e.target.value })} className="w-full p-3 rounded-xl bg-background-dark border border-border-dark text-sm min-h-[80px]" />
                  <Button type="submit" variant="primary" className="w-full"> {t('quote.form.submitButton')} </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
