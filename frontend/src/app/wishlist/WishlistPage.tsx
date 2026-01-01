'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { wishlistService } from '@/services/wishlistService';
import { useToast } from '@/contexts/ToastContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

interface WishlistItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    images: Array<{
      url: string;
      publicId: string;
    }>;
    categoryId: {
      _id: string;
      name: string;
    };
    brandId: {
      _id: string;
      name: string;
    };
    isActive: boolean;
    stock: number;
  };
  addedAt: string;
}

interface Wishlist {
  userId: string;
  items: WishlistItem[];
  totalItems: number;
}

export default function WishlistPage() {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      setWishlist(data);
    } catch (error: any) {
      console.error('Load wishlist error:', error);
      showError(error.message || 'Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setRemovingItems(prev => new Set(prev).add(productId));
      await wishlistService.removeFromWishlist(productId);
      setWishlist(prev => prev ? {
        ...prev,
        items: prev.items.filter(item => item.productId._id !== productId),
        totalItems: prev.totalItems - 1
      } : null);
      showSuccess('Đã xóa sản phẩm khỏi danh sách yêu thích');
    } catch (error: any) {
      console.error('Remove from wishlist error:', error);
      showError(error.message || 'Không thể xóa sản phẩm khỏi danh sách yêu thích');
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleAddToCart = (productId: string) => {
    // TODO: Implement add to cart functionality
    showSuccess('Chức năng thêm vào giỏ hàng đang được phát triển');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface-dark border-b border-border-dark py-10 px-4">
        <div className="mx-auto max-w-[1200px]">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            Danh sách yêu thích
          </h1>
          <p className="text-slate-400 max-w-2xl">
            {wishlist?.totalItems || 0} sản phẩm trong danh sách yêu thích của bạn
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-4 py-10">
        {!wishlist || wishlist.items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="mx-auto h-24 w-24 text-slate-400 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Danh sách yêu thích trống
            </h2>
            <p className="text-slate-400 mb-8">
              Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.
            </p>
            <Button onClick={() => router.push('/catalog')}>
              Khám phá sản phẩm
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.items.map((item) => (
              <div
                key={item.productId._id}
                className="bg-surface-dark border border-border-dark rounded-3xl p-6 group hover:border-primary/50 transition-colors"
              >
                {/* Product Image */}
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-background-dark">
                  <img
                    src={item.productId.images?.[0]?.url || '/placeholder-product.jpg'}
                    alt={item.productId.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-lg line-clamp-2 mb-1">
                      {item.productId.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span>{item.productId.brandId?.name}</span>
                      <span>•</span>
                      <span>{item.productId.categoryId?.name}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-white">
                      {item.productId.price.toLocaleString()}đ
                    </span>
                    <span className="text-sm text-slate-400">
                      Còn {item.productId.stock} sản phẩm
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => handleAddToCart(item.productId._id)}
                    >
                      Thêm vào giỏ
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={removingItems.has(item.productId._id)}
                      onClick={() => handleRemoveFromWishlist(item.productId._id)}
                      className="px-3"
                    >
                      {removingItems.has(item.productId._id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Added date */}
                  <div className="text-xs text-slate-500 pt-2 border-t border-border-dark">
                    Đã thêm: {new Date(item.addedAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
