import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import { productService } from '@/services/productService';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/store/ProductCard';
import type { Product } from '@/types/product';

interface ProductData {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  tag?: string;
  rating: number;
  inStock: boolean;
}

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [flashSaleProducts, setFlashSaleProducts] = useState<ProductData[]>([]);
  const [newProducts, setNewProducts] = useState<{ laptops: ProductData[]; pcs: ProductData[]; accessories: ProductData[] }>({
    laptops: [],
    pcs: [],
    accessories: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);

        // Load flash sale products (mock)
        const mockFlashSale: ProductData[] = [
          {
            id: 'flash-1',
            name: 'Gaming Laptop RTX 4070',
            brand: 'ASUS',
            category: 'laptops',
            price: 32000000,
            oldPrice: 35000000,
            tag: 'FLASH SALE',
            rating: 4.8,
            inStock: true
          },
          {
            id: 'flash-2',
            name: 'Mechanical Keyboard RGB',
            brand: 'Corsair',
            category: 'accessories',
            price: 1200000,
            oldPrice: 1490000,
            tag: 'FLASH SALE',
            rating: 4.9,
            inStock: true
          },
          {
            id: 'flash-3',
            name: 'Gaming Mouse Wireless',
            brand: 'Logitech',
            category: 'accessories',
            price: 750000,
            oldPrice: 990000,
            tag: 'FLASH SALE',
            rating: 4.7,
            inStock: true
          }
        ];

        // Load new products by category
        const newProductsData = await productService.getNewProducts(4);
        const mappedNewProducts = {
          laptops: newProductsData.laptops.map(p => ({
            id: p.id,
            name: p.name,
            brand: (p as any).brand || p.name.split(' ')[0],
            category: p.category || 'laptops',
            price: p.price,
            oldPrice: (p as any).originalPrice,
            rating: p.rating || 4.5,
            inStock: p.inStock !== false
          })),
          pcs: newProductsData.pcs.map(p => ({
            id: p.id,
            name: p.name,
            brand: (p as any).brand || p.name.split(' ')[0],
            category: p.category || 'pcs',
            price: p.price,
            oldPrice: (p as any).originalPrice,
            rating: p.rating || 4.5,
            inStock: p.inStock !== false
          })),
          accessories: newProductsData.accessories.map(p => ({
            id: p.id,
            name: p.name,
            brand: (p as any).brand || p.name.split(' ')[0],
            category: p.category || 'accessories',
            price: p.price,
            oldPrice: (p as any).originalPrice,
            rating: p.rating || 4.5,
            inStock: p.inStock !== false
          }))
        };

        setFlashSaleProducts(mockFlashSale);
        setNewProducts(mappedNewProducts);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleAddToCart = async (product: ProductData) => {
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero Section (ported from EXE101) */}
      <section className="pt-6 pb-12 px-4">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[480px]">
            {/* Main Banner Slider */}
            <div
              className="lg:col-span-8 relative rounded-2xl overflow-hidden group border border-border cursor-pointer h-[400px] lg:h-full shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1600"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90"
                alt="Main Banner"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8 sm:p-12">
                <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-lg w-fit mb-3 shadow-lg shadow-red-600/30">
                  {t('home.hero.flagship')}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
                  {t('home.hero.title')}
                </h2>
                <p className="text-slate-300 text-lg mb-6 max-w-lg hidden sm:block">
                  {t('home.hero.subtitle')}
                </p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center px-6 py-3 bg-white text-black font-black rounded-xl shadow-xl hover:bg-red-600 hover:text-white transition-all"
                >
                  {t('home.hero.explore')}
                </Link>
              </div>
            </div>

            {/* Side Banners */}
            <div className="lg:col-span-4 flex flex-col gap-4 h-full">
              <div
                onClick={() => {}}
                className="flex-1 relative rounded-2xl overflow-hidden group border border-border cursor-pointer min-h-[200px]"
              >
                <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" alt="Sub Banner 1" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/80 p-6 flex flex-col justify-center">
                  <h3 className="text-2xl font-black text-white uppercase italic">{t('home.sideBanner.esport')}</h3>
                  <p className="text-sm text-red-500 font-bold">{t('home.sideBanner.esportSub')}</p>
                </div>
              </div>
              <div
                onClick={() => {}}
                className="flex-1 relative rounded-2xl overflow-hidden group border border-border cursor-pointer min-h-[200px]"
              >
                <img src="https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" alt="Sub Banner 2" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80 p-6 flex flex-col justify-center text-right items-end">
                  <h3 className="text-2xl font-black text-white uppercase italic">{t('home.sideBanner.build')}</h3>
                  <p className="text-sm text-red-500 font-bold">{t('home.sideBanner.buildSub')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background border border-border rounded-3xl p-6 text-center hover:border-primary/50 transition-all group">
              <div className="size-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl text-emerald-500">local_shipping</span>
              </div>
              <h3 className="font-bold text-text-main mb-2">{t('home.features.freeShipping.title')}</h3>
              <p className="text-sm text-text-muted">{t('home.features.freeShipping.subtitle')}</p>
            </div>
            <div className="bg-background border border-border rounded-3xl p-6 text-center hover:border-primary/50 transition-all group">
              <div className="size-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl text-blue-500">verified</span>
              </div>
              <h3 className="font-bold text-text-main mb-2">{t('home.features.warranty.title')}</h3>
              <p className="text-sm text-text-muted">{t('home.features.warranty.subtitle')}</p>
            </div>
            <div className="bg-background border border-border rounded-3xl p-6 text-center hover:border-primary/50 transition-all group">
              <div className="size-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl text-yellow-500">refresh</span>
              </div>
              <h3 className="font-bold text-text-main mb-2">{t('home.features.return.title')}</h3>
              <p className="text-sm text-text-muted">{t('home.features.return.subtitle')}</p>
            </div>
            <div className="bg-background border border-border rounded-3xl p-6 text-center hover:border-primary/50 transition-all group">
              <div className="size-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl text-purple-500">support_agent</span>
              </div>
              <h3 className="font-bold text-text-main mb-2">{t('home.features.support.title')}</h3>
              <p className="text-sm text-text-muted">{t('home.features.support.subtitle')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-text-main mb-2">{t('home.flashSale.title')}</h2>
              <p className="text-text-muted">{t('home.flashSale.subtitle', { defaultValue: 'Limited time offers on premium gaming gear' })}</p>
            </div>
            <button className="text-primary hover:text-primary/80 font-bold">{t('home.flashSale.viewAll')}</button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-surface border border-border rounded-3xl p-6 animate-pulse">
                  <div className="aspect-square bg-border/20 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-border/20 rounded mb-2"></div>
                  <div className="h-6 bg-border/20 rounded mb-4"></div>
                  <div className="h-10 bg-border/20 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashSaleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  tag={product.tag}
                  rating={product.rating}
                  inStock={product.inStock}
                  brand={product.brand}
                  category={product.category}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-text-main mb-2">{t('home.newArrivals.title')}</h2>
            <p className="text-text-muted">{t('home.newArrivals.subtitle', { defaultValue: 'Latest gaming gear and components' })}</p>
          </div>

          {loading ? (
            <div className="space-y-12">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="h-8 bg-border/20 rounded mb-6 w-48"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="bg-background border border-border rounded-3xl p-6 animate-pulse">
                        <div className="aspect-square bg-border/20 rounded-2xl mb-4"></div>
                        <div className="h-4 bg-border/20 rounded mb-2"></div>
                        <div className="h-6 bg-border/20 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {/* Laptops */}
              {newProducts.laptops.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-6">{t('home.categories.gamingLaptop')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {newProducts.laptops.slice(0, 4).map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        oldPrice={product.oldPrice}
                        rating={product.rating}
                        inStock={product.inStock}
                        brand={product.brand}
                        category={product.category}
                        onAddToCart={() => handleAddToCart(product)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Accessories */}
              {newProducts.accessories.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-6">{t('home.categories.accessories', { defaultValue: 'Gaming Accessories' })}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {newProducts.accessories.slice(0, 4).map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        oldPrice={product.oldPrice}
                        rating={product.rating}
                        inStock={product.inStock}
                        brand={product.brand}
                        category={product.category}
                        onAddToCart={() => handleAddToCart(product)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
