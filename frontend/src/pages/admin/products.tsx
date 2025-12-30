import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  category: string;
}

const AdminProducts: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data
    const loadProducts = async () => {
      try {
        setLoading(true);
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Gaming Laptop RTX 4070',
            brand: 'ASUS',
            price: 35000000,
            stock: 15,
            status: 'active',
            category: 'Laptop Gaming'
          },
          {
            id: '2',
            name: 'Mechanical Keyboard RGB',
            brand: 'Corsair',
            price: 1200000,
            stock: 25,
            status: 'active',
            category: 'Bàn phím'
          },
          {
            id: '3',
            name: 'Gaming Mouse Wireless',
            brand: 'Logitech',
            price: 800000,
            stock: 0,
            status: 'inactive',
            category: 'Chuột'
          }
        ];
        setProducts(mockProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-text-main tracking-tight">{t('admin.products.title')}</h1>
            <p className="text-text-muted mt-2">{t('admin.products.subtitle')}</p>
          </div>
          <Button>Thêm sản phẩm</Button>
        </div>

        {/* Search & Filters */}
        <div className="bg-surface border border-border rounded-3xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('admin.products.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-main placeholder-text-muted focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <select className="bg-background border border-border rounded-xl px-4 py-3 text-text-main focus:ring-1 focus:ring-primary outline-none">
              <option>Tất cả danh mục</option>
              <option>Laptop Gaming</option>
              <option>Bàn phím</option>
              <option>Chuột</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-surface border border-border rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">
                    {t('admin.products.table.name')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">
                    {t('admin.products.table.brand')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">
                    Kho
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">
                    {t('admin.products.table.status')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-main uppercase tracking-wider">
                    {t('admin.products.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-text-main">{product.name}</p>
                        <p className="text-sm text-text-muted">{product.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-main font-medium">{product.brand}</td>
                    <td className="px-6 py-4 text-text-main font-bold">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        product.stock > 10 ? 'bg-emerald-500/10 text-emerald-500' :
                        product.stock > 0 ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {product.status === 'active' ? 'Hoạt động' : 'Ngưng bán'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 border border-border rounded-lg text-text-main hover:border-primary transition-colors text-sm">
                          Sửa
                        </button>
                        <button className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm">
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-4xl text-text-muted mb-4 block">inventory_2</span>
              <p className="text-text-muted">{t('admin.products.noProductsMatch')}</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-border rounded-lg text-text-muted hover:text-text-main transition-colors">
              Trước
            </button>
            <button className="px-4 py-2 bg-primary text-black rounded-lg font-bold">1</button>
            <button className="px-4 py-2 border border-border rounded-lg text-text-muted hover:text-text-main transition-colors">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
