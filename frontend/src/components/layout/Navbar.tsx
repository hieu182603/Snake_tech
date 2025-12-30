'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useToast } from '@/contexts/ToastContext';
import { useTranslation } from '@/hooks/useTranslation';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { showSuccess } = useToast();
  const [search, setSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Notification State (simplified for now)
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // States for features
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');

  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: lang === 'vi' ? 'Trang chủ' : 'Home', path: '/' },
    { name: lang === 'vi' ? 'Sản phẩm' : 'Products', path: '/catalog' },
    { name: lang === 'vi' ? 'Báo giá' : 'Quote', path: '/quote' },
    { name: lang === 'vi' ? 'Tra cứu' : 'Tracking', path: '/history' },
  ];

  // Calculate cart items count (simplified - would need cart context)
  const cartItemsCount = 0; // TODO: integrate with cart context

  // Initialize Theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (document.documentElement.classList.contains('dark')) {
        setIsDark(true);
      } else {
        setIsDark(false);
      }
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  const toggleLang = () => {
    setLang(prev => prev === 'vi' ? 'en' : 'vi');
  };

  const handleLogout = () => {
    authService.logout();
    setShowProfileMenu(false);
    router.push('/auth/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  return (
    <div className="sticky top-0 z-50 w-full flex flex-col">
      {/* 1. Top Bar (Premium Look) */}
      <div className="bg-primary text-white text-[10px] sm:text-xs font-bold py-1.5 px-4 relative z-50">
        <div className="mx-auto max-w-[1440px] flex justify-between items-center">
          <div className="flex gap-4">
            <span className="hidden sm:inline opacity-90">Hotline: 1900 1234</span>
            <span className="opacity-90">Email: support@techstore.vn</span>
          </div>
          <div className="flex gap-4 items-center">
            {isAuthenticated && user && (() => {
              const userRole = user.role || '';
              const isAdmin = userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'STAFF';

              return isAdmin && (
                <Link href="/admin" className="hover:underline opacity-90">Kênh người bán</Link>
              );
            })()}
          </div>
        </div>
      </div>

      {/* 2. Main Navbar */}
      <header className="w-full border-b border-border-dark bg-background-dark/80 backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto flex h-16 sm:h-20 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">

          {/* Logo & Links */}
          <div className="flex items-center gap-8 md:gap-12">
            <Link href="/" className="flex items-center gap-2 text-primary group">
              <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <title>Snake</title>
                  <path d="M3 12c1.5-4 6-6 9-6 2 0 3.5.8 4.5 2 .6.8.6 1.8 0 2.6-.5.6-1.4.8-2 .3-.7-.6-1.6-1-2.8-1-2.2 0-4.5 1.6-6 4-1 1.5-1 3 .5 3.8.6.4 1.4.3 2-.2.6-.5 1-1 2-1 1.2 0 2 .6 3 1 .6.3 1 .5 1.6.5 1.8 0 3-1 4-2 1.5-1.5 3.5-1 4.5 0" />
                </svg>
              </div>
              <div className="hidden lg:flex flex-col">
                <h1 className="text-xl font-black tracking-tighter text-text-main uppercase font-display leading-none">Snake Tech</h1>
                <span className="text-[9px] font-bold text-text-muted tracking-[0.3em] uppercase">Premium Gear</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center bg-surface-dark/50 p-1 rounded-full border border-border-dark">
              <Link href="/" className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${pathname === '/' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-white/10'}`}>{t('nav.home')}</Link>
              <Link href="/catalog" className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${pathname === '/catalog' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-white/10'}`}>{t('nav.products')}</Link>
              <Link href="/quote" className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${pathname === '/quote' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-white/10'}`}>{t('nav.quote')}</Link>
              <Link href="/history" className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${pathname === '/history' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-white/10'}`}>{t('nav.tracking')}</Link>
            </nav>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative group">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-12 pr-4 rounded-full border border-border-dark bg-surface-dark text-text-main placeholder-text-muted focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none text-sm transition-all shadow-sm"
              placeholder={t('nav.searchPlaceholder')}
            />
            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-5">

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="size-10 rounded-full border border-border-dark bg-surface-dark text-text-muted hover:text-primary hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all font-black text-[10px]"
              title={lang === 'vi' ? 'Language' : 'Ngôn ngữ'}
            >
              {lang === 'vi' ? 'VN' : 'EN'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="size-10 rounded-full border border-border-dark bg-surface-dark text-text-muted hover:text-primary hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              <span className="material-symbols-outlined text-[20px] transition-transform duration-500 rotate-0 dark:-rotate-180">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Notification Toggle */}
            {isAuthenticated && user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative size-10 rounded-full border border-border-dark bg-surface-dark text-text-muted hover:text-primary hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all"
                  title="Thông báo"
                >
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  {/* TODO: Add unread count logic */}
                  {/* {unreadCount > 0 && (
                    <span className="absolute top-2 right-2.5 size-2 rounded-full bg-primary ring-2 ring-background-dark animate-pulse shadow-sm"></span>
                  )} */}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-surface-dark border border-border-dark rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50 ring-1 ring-black/5">
                    <div className="p-4 border-b border-border-dark flex justify-between items-center bg-surface-accent/50 backdrop-blur-sm">
                      <h4 className="font-bold text-text-main text-sm flex items-center gap-2">
                        Thông báo
                        {/* TODO: Add unread count display */}
                        {/* {unreadCount > 0 && <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-md">{unreadCount} mới</span>} */}
                      </h4>
                      {/* TODO: Add mark all as read functionality */}
                      {/* <button className="text-[10px] text-primary font-bold hover:underline">Đánh dấu đã đọc</button> */}
                    </div>
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                      {/* TODO: Add notifications list */}
                      <div className="py-10 text-center">
                        <span className="material-symbols-outlined text-4xl text-text-muted/30 mb-2">notifications_off</span>
                        <p className="text-xs text-text-muted">Chưa có thông báo nào</p>
                      </div>
                    </div>
                    <div className="p-2 border-t border-border-dark bg-background-dark/30 text-center">
                      <Link
                        href="/profile"
                        onClick={() => setShowNotifications(false)}
                        className="block w-full py-1.5 text-[11px] font-bold text-text-muted hover:text-text-main hover:bg-surface-accent rounded-lg transition-all"
                      >
                        Xem tất cả thông báo
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative size-10 rounded-full border border-border-dark bg-surface-dark text-text-muted hover:text-primary hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all group">
              <span className="material-symbols-outlined text-[20px] group-hover:animate-bounce-slow">shopping_bag</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white border-2 border-background-dark">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Link>

            <div className="h-8 w-px bg-border-dark hidden sm:block"></div>

            {/* User Profile */}
            {isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 rounded-full hover:bg-surface-accent pr-1 transition-all group"
                >
                  <div className="size-10 rounded-full overflow-hidden border-2 border-border-dark group-hover:border-primary transition-all bg-surface-dark flex items-center justify-center">
                    {user.username ? (
                      <span className="text-primary font-black text-sm">
                        {(user.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-text-muted">person</span>
                    )}
                  </div>
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-bold text-text-main leading-none">
                      {user.username || 'User'}
                    </span>
                    <span className="text-[10px] text-primary font-black uppercase">
                      {user.role || 'CUSTOMER'}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-4 w-60 bg-surface-dark border border-border-dark rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
                    <div className="px-4 py-3 bg-surface-accent rounded-xl mb-2">
                      <p className="text-sm font-bold text-text-main">{user.username || 'User'}</p>
                      <p className="text-xs text-text-muted truncate">{user.username || user.email || ''}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-background-dark hover:text-text-main transition-all"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <span className="material-symbols-outlined text-[20px]">person</span>
                      Profile
                    </Link>
                    <Link
                      href="/history"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-background-dark hover:text-text-main transition-all"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                      Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-background-dark hover:text-text-main transition-all"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <span className="material-symbols-outlined text-[20px]">favorite</span>
                      Wishlist
                    </Link>
                    <div className="h-px bg-border-dark my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-dark bg-surface-dark text-text-muted hover:text-primary hover:border-primary hover:bg-primary/5 transition-all text-sm font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span className="hidden sm:inline">Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
