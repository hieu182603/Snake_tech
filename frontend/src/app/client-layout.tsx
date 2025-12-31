'use client';

import '@/i18n/init';

import { ToastProvider } from "@/contexts/ToastContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { usePathname } from "next/navigation";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();

  // Hide footer on auth pages
  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <I18nProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            {!isAuthPage && <Navbar />}
            <main className="min-h-screen">
              {children}
            </main>
            {!isAuthPage && <Footer />}
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
