import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/store/ProductCard';
import { useTranslation } from '@/hooks/useTranslation';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
}

const Wishlist: React.FC = () => {
  const { t } = useTranslation();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock wishlist data - replace with actual wishlist service
    const loadWishlist = async () => {
      try {
        setLoading(true);
        // Mock data
        const mockItems: WishlistItem[] = [
          {
            id: '1',
            name: 'Gaming Laptop RTX 4070',
            price: 3500000,
            imageUrl: 'https://picsum.photos/400/300?random=laptop',
            inStock: true
          },
          {
            id: '2',
            name: 'Mechanical Keyboard RGB',
            price: 1200000,
            imageUrl: 'https://picsum.photos/400/300?random=keyboard',
            inStock: true
          },
          {
            id: '3',
            name: 'Gaming Mouse Wireless',
            price: 800000,
            imageUrl: 'https://picsum.photos/400/300?random=mouse',
            inStock: false
          }
        ];
        setWishlistItems(mockItems);
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearAllWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-text-main tracking-tight">{t('wishlist.title')}</h1>
            <p className="text-text-muted mt-2">{t('wishlist.subtitle', { count: wishlistItems.length })}</p>
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={clearAllWishlist}
              className="px-4 py-2 border border-red-500/20 bg-red-500/10 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
            >
              {t('wishlist.actions.clearAll')}
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-muted">{t('wishlist.loading', { defaultValue: 'Loading wishlist...' })}</p>
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="relative group">
                <ProductCard
                  id={item.id}
                  name={item.name}
                  price={`${item.price.toLocaleString()}₫`}
                  imageUrl={item.imageUrl}
                />
                {/* Remove button overlay */}
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="absolute top-3 right-3 size-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600"
                  title={t('wishlist.actions.remove')}
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{t('wishlist.outOfStock')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-surface border border-border rounded-3xl">
            <div className="size-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
              <span className="material-symbols-outlined text-4xl text-text-muted">favorite_border</span>
            </div>
            <h3 className="text-lg font-bold text-text-main mb-2">{t('wishlist.empty.title')}</h3>
            <p className="text-text-muted mb-6">{t('wishlist.empty.description')}</p>
            <a
              href="/catalog"
              className="inline-block px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/80 transition-all"
            >
              {t('wishlist.empty.explore')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
