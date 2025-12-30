import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';

interface Component {
  id: string;
  name: string;
  category: string;
  price: number;
  selected: boolean;
}

const QuoteRequest: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('cpu');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComponents, setSelectedComponents] = useState<Component[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    note: ''
  });

  // Mock component data
  const mockComponents: Component[] = [
    { id: '1', name: 'Intel Core i7-13700K', category: 'cpu', price: 12000000, selected: false },
    { id: '2', name: 'AMD Ryzen 7 7800X3D', category: 'cpu', price: 11000000, selected: false },
    { id: '3', name: 'ASUS ROG Strix B650', category: 'motherboard', price: 8000000, selected: false },
    { id: '4', name: 'Corsair Vengeance 32GB', category: 'ram', price: 3500000, selected: false },
    { id: '5', name: 'RTX 4070 Super 12GB', category: 'gpu', price: 18000000, selected: false },
  ];

  const categories = [
    { id: 'cpu', name: 'Vi xử lý' },
    { id: 'motherboard', name: 'Bo mạch chủ' },
    { id: 'ram', name: 'RAM' },
    { id: 'gpu', name: 'Card đồ họa' },
    { id: 'drive', name: 'SSD/HDD' },
    { id: 'psu', name: 'Nguồn' },
    { id: 'case', name: 'Vỏ máy' },
    { id: 'cooler', name: 'Tản nhiệt' },
    { id: 'monitor', name: 'Màn hình' },
    { id: 'accessories', name: 'Phụ kiện' },
  ];

  const filteredComponents = mockComponents.filter(comp =>
    comp.category === selectedCategory &&
    comp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleComponent = (component: Component) => {
    setSelectedComponents(prev => {
      const exists = prev.find(c => c.id === component.id);
      if (exists) {
        return prev.filter(c => c.id !== component.id);
      } else {
        return [...prev, { ...component, selected: true }];
      }
    });
  };

  const handleSubmitQuote = () => {
    if (selectedComponents.length === 0 || !formData.name || !formData.phone) {
      alert(t('quote.errors.noItems') || 'Vui lòng chọn ít nhất một sản phẩm và điền đầy đủ thông tin.');
      return;
    }

    console.log('Quote request:', {
      components: selectedComponents,
      contact: formData,
      total: selectedComponents.reduce((sum, comp) => sum + comp.price, 0)
    });

    alert(t('quote.success.submitMessage', {
      defaultValue: 'Đã gửi yêu cầu báo giá thành công! Chúng tôi sẽ liên hệ sớm.'
    }));
  };

  const totalPrice = selectedComponents.reduce((sum, comp) => sum + comp.price, 0);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-text-main tracking-tight mb-4">{t('quote.title')}</h1>
          <p className="text-text-muted max-w-2xl mx-auto">{t('quote.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Component Selection */}
          <div className="lg:col-span-8">
            <div className="bg-surface border border-border rounded-3xl p-6">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-black'
                        : 'bg-background border border-border text-text-main hover:border-primary'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder={t('quote.searchPlaceholder', { category: categories.find(c => c.id === selectedCategory)?.name })}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-main placeholder-text-muted focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Components List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredComponents.map(comp => (
                  <div
                    key={comp.id}
                    onClick={() => toggleComponent(comp)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedComponents.find(c => c.id === comp.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-text-main">{comp.name}</h3>
                        <p className="text-text-muted font-bold">{comp.price.toLocaleString()}₫</p>
                      </div>
                      <div className={`size-6 rounded-full border-2 flex items-center justify-center ${
                        selectedComponents.find(c => c.id === comp.id)
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}>
                        {selectedComponents.find(c => c.id === comp.id) && (
                          <span className="material-symbols-outlined text-white text-sm">check</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Components & Form */}
          <div className="lg:col-span-4 space-y-6">
            {/* Selected Components */}
            <div className="bg-surface border border-border rounded-3xl p-6">
              <h3 className="text-lg font-bold text-text-main mb-4">{t('quote.selectedTitle')}</h3>

              {selectedComponents.length > 0 ? (
                <div className="space-y-3">
                  {selectedComponents.map(comp => (
                    <div key={comp.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-xl">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-main text-sm truncate">{comp.name}</p>
                        <p className="text-text-muted text-xs">{comp.price.toLocaleString()}₫</p>
                      </div>
                      <button
                        onClick={() => toggleComponent(comp)}
                        className="ml-2 text-red-500 hover:text-red-600"
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-text-main">{t('quote.totalLabel')}</span>
                      <span className="font-black text-primary text-lg">{totalPrice.toLocaleString()}₫</span>
                    </div>
                    <p className="text-xs text-text-muted mt-1">{t('quote.totalNote')}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-4xl text-text-muted mb-2 block">inventory_2</span>
                  <p className="text-text-muted">{t('quote.emptySelection')}</p>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="bg-surface border border-border rounded-3xl p-6">
              <h3 className="text-lg font-bold text-text-main mb-4">{t('quote.form.title')}</h3>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder={t('quote.form.namePlaceholder')}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-main placeholder-text-muted focus:ring-1 focus:ring-primary outline-none"
                />
                <input
                  type="tel"
                  placeholder={t('quote.form.phonePlaceholder')}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-main placeholder-text-muted focus:ring-1 focus:ring-primary outline-none"
                />
                <input
                  type="email"
                  placeholder={t('quote.form.emailPlaceholder')}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-main placeholder-text-muted focus:ring-1 focus:ring-primary outline-none"
                />
                <textarea
                  placeholder={t('quote.form.notePlaceholder')}
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-main placeholder-text-muted focus:ring-1 focus:ring-primary outline-none h-24"
                />

                <Button
                  onClick={handleSubmitQuote}
                  disabled={selectedComponents.length === 0}
                  className="w-full"
                >
                  {t('quote.form.submitButton')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteRequest;
