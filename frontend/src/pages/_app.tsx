import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { ToastProvider } from '@/contexts/ToastContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { I18nProvider } from '@/components/providers/I18nProvider';

// Material Symbols Font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} font-sans antialiased`}>
      <I18nProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <main className="min-h-screen">
                <Component {...pageProps} />
              </main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </I18nProvider>
    </div>
  );
}
