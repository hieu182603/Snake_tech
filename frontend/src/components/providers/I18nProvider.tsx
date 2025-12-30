'use client';

import { ReactNode, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from '@/i18n/locales/en.json';
import vi from '@/i18n/locales/vi.json';

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Initialize i18next only on client side
    if (!i18n.isInitialized) {
      i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
          resources,
          fallbackLng: 'vi',
          debug: false,
          interpolation: {
            escapeValue: false,
          },
          detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
          },
          parseMissingKeyHandler: (key) => {
            try {
              const parts = String(key).split('.');
              const meaningfulParts = parts.length > 1 ? parts.slice(1) : parts;
              const humanized = meaningfulParts
                .map(p => p.replace(/([A-Z])/g, ' $1'))
                .join(' ')
                .replace(/[_-]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
              return humanized.replace(/\b\w/g, (c) => c.toUpperCase());
            } catch (e) {
              return String(key);
            }
          },
        });
    }
  }, []);

  return <>{children}</>;
}
