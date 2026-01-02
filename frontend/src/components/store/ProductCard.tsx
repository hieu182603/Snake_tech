'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@contexts/ToastContext';
import { useCart } from '@contexts/CartContext';
import { useTranslation } from '../../hooks/useTranslation';
import Image from 'next/image';

interface ProductCardProps {
  id: string | number;
  name: string;
  price: string;
  oldPrice?: string;
  tag?: string;
  rating?: number;
  imageIndex?: number;
  imageUrl?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  oldPrice,
  tag,
  rating = 5,
  imageIndex = 0,
  imageUrl,
}) => {
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);
  const toast = useToast();
  const { addToCart, activeOperations } = useCart();
  const { t } = useTranslation();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdded || activeOperations.has(`add-${id}`)) return;

    try {
      const result = await addToCart(id.toString(), 1);
      if (result.success) {
        setIsAdded(true);
        setTimeout(() => {
          setIsAdded(false);
        }, 2000);
      } else {
        toast?.showError?.(result.error || 'Không thể thêm sản phẩm vào giỏ');
      }
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      toast?.showError?.('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Add to cart first
      const result = await addToCart(id.toString(), 1);
      if (result.success) {
        // Navigate to checkout
        router.push('/checkout');
      } else {
        toast?.showError?.(result.error || 'Không thể thực hiện mua ngay - sản phẩm không tìm thấy');
      }
    } catch (error) {
      console.error('Failed to buy now:', error);
      toast?.showError?.('Không thể mua ngay — vui lòng thử lại');
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${id}`);
  };

  return (
    <div
      onClick={handleViewDetails}
      className="group relative flex flex-col bg-surface-dark rounded-2xl border border-border-dark overflow-hidden transition-all duration-300 hover:border-red-500 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full bg-background-dark overflow-hidden">
        {/* Discount / Tag */}
        {tag && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-surface-dark/90 backdrop-blur-sm border border-red-500/50 text-red-500 text-[11px] font-black tracking-wider shadow-lg">
              {tag}
            </span>
          </div>
        )}

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <Image
            src={`https://picsum.photos/400/300?random=${imageIndex}`}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          />
        )}

        {/* Hover Actions (Eye / Heart) */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button className="size-9 rounded-full bg-surface-dark/90 backdrop-blur-md border border-border-dark text-text-main flex items-center justify-center hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors shadow-lg">
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
          <button className="size-9 rounded-full bg-surface-dark/90 backdrop-blur-md border border-border-dark text-text-main flex items-center justify-center hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors shadow-lg">
            <span className="material-symbols-outlined text-[18px]">favorite</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`material-symbols-outlined text-[14px] ${
                i < rating ? 'text-yellow-400 fill' : 'text-text-tertiary'
              }`}
            >
              star
            </span>
          ))}
        </div>

        {/* Product Name */}
        <h3 className="text-black font-bold text-sm leading-snug mb-4 line-clamp-2 min-h-[2.5em] transition-colors group-hover:text-red-500">
          {name}
        </h3>

        {/* Price & Action */}
        <div className="mt-auto space-y-3">
          <div className="flex flex-col">
            {oldPrice && (
              <span className="text-xs text-text-muted line-through font-medium">
                {oldPrice}
              </span>
            )}
            <span className="text-xl font-black text-red-500 tracking-tight">
              {price}
            </span>
          </div>

          {/* Action Buttons Row - small icon add + main buy button */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleAddToCart}
              disabled={activeOperations.has(`add-${id}`)}
              className={`h-10 w-12 flex items-center justify-center rounded-lg transition-all active:scale-95 border ${
                isAdded
                  ? 'bg-green-600 border-green-600 text-white shadow-md'
                  : activeOperations.has(`add-${id}`)
                  ? 'bg-gray-500 border-gray-500 text-white cursor-not-allowed'
                  : 'bg-surface-accent border-transparent text-text-main hover:border-red-500 hover:text-red-500 hover:bg-white'
              }`}
              title={t('product.addToCartTitle', { defaultValue: 'Thêm vào giỏ' })}
            >
              {activeOperations.has(`add-${id}`) ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
              <span className="material-symbols-outlined text-[20px] fill">
                {isAdded ? 'check' : 'add_shopping_cart'}
              </span>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 h-10 rounded-lg bg-red-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined">bolt</span>
              {t('product.buyNow', { defaultValue: 'Mua ngay' })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
