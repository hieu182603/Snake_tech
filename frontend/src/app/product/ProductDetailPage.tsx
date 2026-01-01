'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { productService } from '@/services/productService';
import type { Product } from '@/types/product';
import { useTranslation } from '@/hooks/useTranslation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProductDetailPageProps {
  id: string;
}

export default function ProductDetailPage({ id }: ProductDetailPageProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productService.getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !user) return;

    setAddingToCart(true);
    try {
      const ok = await addToCart(product.id!, quantity);
      if (ok) {
        toast.success('Đã thêm vào giỏ hàng!');
      } else {
        toast.error('Không thể thêm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Không thể thêm vào giỏ hàng');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || !user) return;

    try {
      const ok = await addToCart(product.id!, quantity);
      if (ok) {
        router.push('/checkout');
      } else {
        toast.error('Không thể mua ngay');
      }
    } catch (error) {
      console.error('Error buying now:', error);
      toast.error('Không thể mua ngay');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Sản phẩm không tồn tại</h1>
          <Link href="/catalog">
            <Button>Quay lại danh mục</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const displayImages = images.length > 0 ? images : [{ url: '/api/placeholder/400/400' }];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-red-500">Trang chủ</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-red-500">Danh mục</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={displayImages[selectedImage]?.url || '/api/placeholder/400/400'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-red-500' : 'border-muted'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-2xl font-bold text-red-500">
                  {product.price.toLocaleString('vi-VN')}₫
                </div>
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">Còn hàng</span>
                ) : (
                  <span className="text-red-600 font-medium">Hết hàng</span>
                )}
              </div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium text-foreground">Số lượng:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-muted"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
                    className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-muted"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!user || product.stock === 0 || addingToCart}
                  className="flex-1"
                  size="lg"
                  variant="outline"
                >
                  {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={!user || product.stock === 0}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  size="lg"
                >
                  Mua ngay
                </Button>
              </div>

              {!user && (
                <p className="text-sm text-muted-foreground text-center">
                  Vui lòng <Link href="/auth/login" className="text-red-500 hover:underline">đăng nhập</Link> để mua hàng
                </p>
              )}
            </div>

            {/* Product Details */}
            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Thông tin sản phẩm</h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Danh mục:</span>
                  <span className="text-foreground">{product.category?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tồn kho:</span>
                  <span className="text-foreground">{product.stock} sản phẩm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <span className="text-foreground">{product.isActive ? 'Đang bán' : 'Ngừng bán'}</span>
                </div>
                {product.brand && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thương hiệu:</span>
                    <span className="text-foreground">{product.brand}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
