import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background to-surface py-20">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold">
                  NEXT LEVEL GAMING PERFORMANCE
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-text-main leading-tight">
                  Gaming Gear for <span className="text-primary">Pros</span>
                </h1>
                <p className="text-xl text-text-muted max-w-lg">
                  Experience ultimate power with the latest RTX 40 Series. Premium components, unbeatable performance, official warranty.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-primary text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/80 transition-colors">
                  Explore Now
                </button>
                <button className="border border-border text-text-main px-8 py-4 rounded-xl font-bold text-lg hover:border-primary transition-colors">
                  View Catalog
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-surface border border-border rounded-3xl p-8 shadow-2xl">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-8xl text-primary">computer</span>
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
              <h3 className="font-bold text-text-main mb-2">Free Shipping</h3>
              <p className="text-sm text-text-muted">For orders over 2,000,000 VND</p>
            </div>
            <div className="bg-background border border-border rounded-3xl p-6 text-center hover:border-primary/50 transition-all group">
              <div className="size-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl text-blue-500">verified</span>
              </div>
              <h3 className="font-bold text-text-main mb-2">Official Warranty</h3>
              <p className="text-sm text-text-muted">100% Full VAT</p>
            </div>
            <div className="bg-background border border-border rounded-3xl p-6 text-center hover:border-primary/50 transition-all group">
              <div className="size-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl text-yellow-500">refresh</span>
              </div>
              <h3 className="font-bold text-text-main mb-2">15-Day Return</h3>
              <p className="text-sm text-text-muted">Exchange for defects</p>
            </div>
            <div className="bg-background border border-border rounded-3xl p-6 text-center hover:border-primary/50 transition-all group">
              <div className="size-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl text-purple-500">support_agent</span>
              </div>
              <h3 className="font-bold text-text-main mb-2">24/7 Support</h3>
              <p className="text-sm text-text-muted">Professional technicians</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-text-main mb-2">FLASH SALE</h2>
              <p className="text-text-muted">Limited time offers on premium gaming gear</p>
            </div>
            <button className="text-primary hover:text-primary/80 font-bold">View all</button>
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
            <h2 className="text-3xl font-black text-text-main mb-2">New Arrivals</h2>
            <p className="text-text-muted">Latest gaming gear and components</p>
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
                  <h3 className="text-xl font-bold text-text-main mb-6">Gaming Laptops</h3>
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
                  <h3 className="text-xl font-bold text-text-main mb-6">Gaming Accessories</h3>
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
