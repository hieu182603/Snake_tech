'use client';

import React from 'react';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import { useTranslation } from '@/hooks/useTranslation';

// Mock cart data for demonstration
const mockCartItems = [
    {
        id: '1',
        product: {
            id: '1',
            name: 'Gaming Laptop Pro',
            price: 1299999,
            images: [{ url: '/api/placeholder/300/300' }],
            color: 'Black'
        },
        quantity: 1
    },
    {
        id: '2',
        product: {
            id: '2',
            name: 'Mechanical Keyboard RGB',
            price: 149999,
            images: [{ url: '/api/placeholder/300/300' }],
            color: 'White'
        },
        quantity: 2
    }
];

const CartPage: React.FC = () => {
    const { showSuccess, showError } = useToast();
    const { t } = useTranslation();

    // Mock cart state - in real app this would come from cart context
    const [items, setItems] = React.useState(mockCartItems);
    const [isLoading, setIsLoading] = React.useState(false);

    const subtotal = items.reduce((acc, curr) => acc + (curr.product?.price || 0) * curr.quantity, 0);

    // Mock cart functions
    const increaseQuantity = (productId: string) => {
        setItems(prev => prev.map(item =>
            item.product.id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        ));
    };

    const decreaseQuantity = (productId: string) => {
        setItems(prev => prev.map(item =>
            item.product.id === productId && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        ));
    };

    const removeItem = (productId: string) => {
        setItems(prev => prev.filter(item => item.product.id !== productId));
        showSuccess(t('cart.item_removed', { defaultValue: 'Sản phẩm đã được xóa khỏi giỏ hàng' }));
    };

    const getItemQuantity = (productId: string) => {
        return items.find(item => item.product.id === productId)?.quantity || 0;
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-32 text-center">
                <div className="size-32 bg-surface-dark border border-border-dark rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-[64px] text-slate-700">shopping_cart_off</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{t('cart.empty_title', { defaultValue: 'Giỏ hàng trống' })}</h2>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">{t('cart.empty_subtitle', { defaultValue: 'Bạn chưa có sản phẩm nào trong giỏ hàng' })}</p>
                <Link href="/catalog">
                    <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-primary/30">
                        {t('cart.continue_shopping', { defaultValue: 'Tiếp tục mua sắm' })}
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-[1440px]">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{t('cart.title', { defaultValue: 'Giỏ hàng' })}</h1>
                <p className="text-slate-400 mt-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                    {t('cart.you_have_items', { defaultValue: 'Bạn có {{count}} sản phẩm trong giỏ hàng', count: items.length })}
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                    {items.map((item) => {
                        const product = item.product || (item as any);
                        const qty = item.quantity;
                        const name = product.name || product.productName || 'Sản phẩm';
                        const price = product.price || 0;
                        const color = (product as any).color || 'N/A';
                        return (
                            <div key={item.id} className="bg-surface-dark rounded-3xl border border-border-dark p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center group hover:border-primary/30 transition-all">

                                {/* Product Info */}
                                <div className="w-full md:flex-1 flex gap-4 md:gap-6 items-center">
                                    <div className="shrink-0 size-20 md:size-24 bg-background-dark rounded-2xl border border-border-dark p-2 flex items-center justify-center overflow-hidden">
                                        {product.images && product.images.length > 0 ? (
                                            <img src={product.images[0].url} alt={name} className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <span className="material-symbols-outlined text-3xl text-slate-600">image</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 pr-4">
                                        <h3 className="font-bold text-white text-base md:text-lg leading-tight line-clamp-2">{name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">{t('cart.variant_label', { defaultValue: 'Phân loại' })}: {color}</span>
                                        </div>
                                        {/* Mobile Price Display */}
                                        <div className="md:hidden mt-2">
                                            <span className="font-bold text-primary">{price.toLocaleString('vi-VN')}₫</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions & Metrics */}
                                <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4 md:gap-8 border-t md:border-t-0 border-border-dark pt-4 md:pt-0">

                                    {/* Desktop Price */}
                                    <div className="hidden md:flex flex-col items-center min-w-[80px]">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t('cart.unit_price', { defaultValue: 'Đơn giá' })}</span>
                                        <span className="font-bold text-white text-sm">{price.toLocaleString('vi-VN')}₫</span>
                                    </div>

                                    {/* Quantity */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase mb-1 md:hidden">{t('cart.quantity', { defaultValue: 'Số lượng' })}</span>
                                        <div className="flex items-center bg-background-dark rounded-xl border border-border-dark p-1 h-10">
                                            <button
                                                className="size-8 p-0 hover:bg-surface-dark rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                                onClick={() => decreaseQuantity(product.id)}
                                            >
                                                <span className="material-symbols-outlined text-sm">remove</span>
                                            </button>
                                            <span className="w-8 text-center text-sm font-bold text-white">{qty}</span>
                                            <button
                                                className="size-8 p-0 hover:bg-surface-dark rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                                onClick={() => increaseQuantity(product.id)}
                                            >
                                                <span className="material-symbols-outlined text-sm">add</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="flex flex-col items-end min-w-[100px]">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase mb-1 md:hidden">{t('cart.subtotal_label', { defaultValue: 'Thành tiền' })}</span>
                                        <span className="font-black text-primary text-lg">{(price * qty).toLocaleString('vi-VN')}₫</span>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => removeItem(product.id)}
                                        className="size-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all ml-2"
                                        title={t('cart.delete_item_title', { defaultValue: 'Xóa sản phẩm' })}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Checkout Summary Sidebar */}
                <div className="lg:w-[380px] shrink-0">
                    <div className="bg-surface-dark rounded-3xl border border-border-dark p-6 md:p-8 sticky top-24 shadow-2xl overflow-hidden">
                        {/* Decoration */}
                        <div className="absolute -top-10 -right-10 size-32 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

                        <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2 relative z-10">
                            <span className="material-symbols-outlined text-primary">receipt_long</span>
                            {t('cart.summary_title', { defaultValue: 'Tóm tắt đơn hàng' })}
                        </h2>

                        <div className="space-y-4 mb-8 relative z-10">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">{t('cart.subtotal', { defaultValue: 'Tạm tính' })}</span>
                                <span className="text-white font-bold">{subtotal.toLocaleString('vi-VN')}₫</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">{t('cart.discount', { defaultValue: 'Giảm giá' })}</span>
                                <span className="text-emerald-400 font-bold">-0₫</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">{t('cart.shipping_fee', { defaultValue: 'Phí vận chuyển' })}</span>
                                <span className="text-emerald-400 font-bold uppercase text-xs tracking-wider bg-emerald-400/10 px-2 py-0.5 rounded">Miễn phí</span>
                            </div>

                            <div className="h-px bg-border-dark my-4"></div>

                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold text-white">{t('cart.total', { defaultValue: 'Tổng cộng' })}</span>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-primary block leading-none">{subtotal.toLocaleString('vi-VN')}₫</span>
                                    <span className="text-[10px] text-slate-500 font-medium">({t('cart.vat_included', { defaultValue: 'Đã bao gồm VAT' })})</span>
                                </div>
                            </div>
                        </div>

                        <Link href="/checkout">
                            <button className="w-full bg-gradient-to-r from-primary to-red-700 hover:to-red-600 border-none text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-red-900/30 relative z-10 transition-all hover:shadow-xl">
                                <span className="flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                    {t('cart.checkout', { defaultValue: 'Thanh toán' })}
                                </span>
                            </button>
                        </Link>

                        <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <span className="material-symbols-outlined text-2xl" title="Bảo mật">lock</span>
                            <span className="material-symbols-outlined text-2xl" title="Visa">credit_card</span>
                            <span className="material-symbols-outlined text-2xl" title="Ví điện tử">account_balance_wallet</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
