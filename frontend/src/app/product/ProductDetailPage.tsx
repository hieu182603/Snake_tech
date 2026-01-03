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
import { useToast } from '@/contexts/ToastContext';

interface ProductDetailPageProps {
  id: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetailPage({ id }: ProductDetailPageProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  // Mock reviews data
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      userName: 'Nguyễn Văn A',
      rating: 5,
      comment: 'Sản phẩm chất lượng tốt, giao hàng nhanh chóng!',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      userName: 'Trần Thị B',
      rating: 4,
      comment: 'Hài lòng với sản phẩm, sẽ ủng hộ shop lần sau.',
      createdAt: '2024-01-10'
    }
  ]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productService.getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error loading product:', error);
        toast.showError(t('product.loadError', { defaultValue: 'Không thể tải thông tin sản phẩm' }));
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
      const pid = (product as any).id || (product as any)._id;
      if (!pid) {
        console.error('Product id missing when adding to cart', product);
        toast.error(t('cart.addError', { defaultValue: 'Không thể thêm vào giỏ hàng' }));
        return;
      }
      const result = await addToCart(pid.toString(), quantity);
      if (result.success) {
        toast.showSuccess(t('cart.added', { defaultValue: 'Đã thêm vào giỏ hàng!' }));
      } else {
        toast.showError(result.error || t('cart.addError', { defaultValue: 'Không thể thêm vào giỏ hàng' }));
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(t('cart.addError', { defaultValue: 'Không thể thêm vào giỏ hàng' }));
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || !user) return;

    try {
      const result = await addToCart(product.id!, quantity);
      if (result.success) {
        router.push('/checkout');
      } else {
        toast.error(result.error || t('cart.buyNowError', { defaultValue: 'Không thể mua ngay' }));
      }
    } catch (error) {
      console.error('Error buying now:', error);
      toast.error(t('cart.buyNowError', { defaultValue: 'Không thể mua ngay' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">{t('product.loading', { defaultValue: 'Đang tải sản phẩm...' })}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl text-muted-foreground">📦</div>
          <h1 className="text-2xl font-bold text-foreground">{t('product.notFound', { defaultValue: 'Sản phẩm không tồn tại' })}</h1>
          <p className="text-muted-foreground">{t('product.notFoundDesc', { defaultValue: 'Sản phẩm bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại.' })}</p>
          <Link href="/catalog">
            <Button size="lg">
              {t('product.backToCatalog', { defaultValue: 'Quay lại danh mục' })}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const displayImages = images.length > 0 ? images : [{ url: '/api/placeholder/400/400', name: 'placeholder' }];
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card/50 border-b border-border/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              {t('nav.home', { defaultValue: 'Trang chủ' })}
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link href="/catalog" className="hover:text-primary transition-colors">
              {t('nav.catalog', { defaultValue: 'Danh mục' })}
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Product Images Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden group shadow-xl">
              <img
                src={displayImages[selectedImage]?.url || '/api/placeholder/400/400'}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />

              {/* Stock Status Badge */}
              <div className="absolute top-4 left-4">
                {product.stock > 0 ? (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    {t('product.inStock', { defaultValue: 'Còn hàng' })}
                  </div>
                ) : (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">cancel</span>
                    {t('product.outOfStock', { defaultValue: 'Hết hàng' })}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {displayImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? 'border-primary shadow-lg scale-105'
                        : 'border-muted hover:border-primary/50'
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

          {/* Enhanced Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-3 leading-tight">
                    {product.name}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`material-symbols-outlined text-lg ${
                            i < Math.floor(averageRating) ? 'text-yellow-400 fill' : 'text-muted-foreground'
                          }`}
                        >
                          star
                        </span>
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">
                        ({reviews.length} {t('product.reviews', { defaultValue: 'đánh giá' })})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <div className="text-4xl font-black text-primary tracking-tight">
                  {product.price.toLocaleString('vi-VN')}₫
                </div>
                {product.category?.name && (
                  <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {product.category.name}
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{product.stock}</div>
                  <div className="text-sm text-muted-foreground">{t('product.stock', { defaultValue: 'Tồn kho' })}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {product.isActive ?
                      <span className="text-green-600">✓</span> :
                      <span className="text-red-600">✗</span>
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">{t('product.status', { defaultValue: 'Trạng thái' })}</div>
                </div>
              </div>
            </div>

            {/* Description Preview */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">{t('product.description', { defaultValue: 'Mô tả sản phẩm' })}</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-6">
              {/* Quantity Selector */}
              <div className="flex items-center gap-6">
                <label className="font-semibold text-foreground text-lg">
                  {t('product.quantity', { defaultValue: 'Số lượng' })}:
                </label>
                <div className="flex items-center gap-3 bg-muted rounded-xl p-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-background hover:border-primary transition-all"
                    disabled={quantity <= 1}
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="w-16 text-center font-bold text-xl">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-background hover:border-primary transition-all"
                    disabled={quantity >= (product.stock || 999)}
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!user || product.stock === 0 || addingToCart}
                  size="lg"
                  variant="outline"
                  className="h-14 text-lg font-semibold"
                >
                  {addingToCart ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                      {t('product.adding', { defaultValue: 'Đang thêm...' })}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                      {t('product.addToCart', { defaultValue: 'Thêm vào giỏ hàng' })}
                    </div>
                  )}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={!user || product.stock === 0}
                  size="lg"
                  className="h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined">bolt</span>
                    {t('product.buyNow', { defaultValue: 'Mua ngay' })}
                  </div>
                </Button>
              </div>

              {!user && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <p className="text-blue-800 font-medium mb-2">
                    {t('product.loginRequired', { defaultValue: 'Vui lòng đăng nhập để mua hàng' })}
                  </p>
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                      {t('nav.login', { defaultValue: 'Đăng nhập' })}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-16 border-t border-border pt-12">
          <div className="flex border-b border-border mb-8">
            {[
              { id: 'description', label: t('product.description', { defaultValue: 'Mô tả' }) },
              { id: 'specifications', label: t('product.specifications', { defaultValue: 'Thông số kỹ thuật' }) },
              { id: 'reviews', label: t('product.reviews', { defaultValue: 'Đánh giá' }) }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {activeTab === 'description' && (
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  {t('product.descriptionExtended', {
                    defaultValue: 'Sản phẩm này được thiết kế với công nghệ tiên tiến nhất, mang đến hiệu suất vượt trội và độ bền cao. Với chất lượng được kiểm soát nghiêm ngặt, chúng tôi cam kết mang đến cho khách hàng trải nghiệm tốt nhất.'
                  })}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-foreground">{t('product.technicalSpecs', { defaultValue: 'Thông số kỹ thuật' })}</h4>
                  <div className="space-y-3">
                    {[
                      { label: t('product.brand', { defaultValue: 'Thương hiệu' }), value: product.category?.name || 'N/A' },
                      { label: t('product.model', { defaultValue: 'Model' }), value: product.name },
                      { label: t('product.warranty', { defaultValue: 'Bảo hành' }), value: '12 tháng' },
                      { label: t('product.origin', { defaultValue: 'Xuất xứ' }), value: 'Việt Nam' }
                    ].map((spec, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">{spec.label}:</span>
                        <span className="text-foreground font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-foreground">{t('product.dimensions', { defaultValue: 'Kích thước & Trọng lượng' })}</h4>
                  <div className="space-y-3">
                    {[
                      { label: t('product.weight', { defaultValue: 'Trọng lượng' }), value: '2.5 kg' },
                      { label: t('product.dimensions', { defaultValue: 'Kích thước' }), value: '30 x 20 x 10 cm' },
                      { label: t('product.material', { defaultValue: 'Chất liệu' }), value: 'Nhôm hợp kim' }
                    ].map((spec, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">{spec.label}:</span>
                        <span className="text-foreground font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Review Summary */}
                <div className="bg-muted/30 rounded-xl p-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-black text-primary">{averageRating.toFixed(1)}</div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`material-symbols-outlined text-xl ${
                              i < Math.floor(averageRating) ? 'text-yellow-400 fill' : 'text-muted-foreground'
                            }`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {reviews.length} {t('product.reviews', { defaultValue: 'đánh giá' })}
                      </div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter(r => r.rating === star).length;
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-3 mb-2">
                            <span className="text-sm w-8">{star}★</span>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-border rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold text-sm">
                            {review.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-foreground">{review.userName}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`material-symbols-outlined text-sm ${
                                      i < review.rating ? 'text-yellow-400 fill' : 'text-muted-foreground'
                                    }`}
                                  >
                                    star
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">{review.createdAt}</span>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
