import { useTranslation as useI18nextTranslation, TFunction } from 'react-i18next';

function humanizeMissingKey(key: string) {
  try {
    const parts = String(key).split('.');
    const meaningful = parts.length > 1 ? parts.slice(1) : parts;
    const humanized = meaningful
      .map(p => p.replace(/([A-Z])/g, ' $1'))
      .join(' ')
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return humanized.replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return String(key);
  }
}

export const useTranslation = () => {
  const { t: origT, i18n } = useI18nextTranslation();

  // safe translator: if translation returns the raw key or a humanized missing-key value,
  // fall back to options.defaultValue to avoid hydration mismatches between server/client.
  const t: TFunction = (key: string, options?: any) => {
    try {
      const res = origT(key, options);
      const missingHuman = humanizeMissingKey(key);
      if (!res) return options?.defaultValue ?? key;
      if (res === key || res === missingHuman) {
        return options?.defaultValue ?? res;
      }
      return res;
    } catch {
      return options?.defaultValue ?? key;
    }
  };

  const changeLanguage = (lng: string) => {
    if (!i18n) return;
    i18n.changeLanguage(lng);
  };

  const getCurrentLanguage = () => {
    return i18n?.language || 'vi';
  };

  const isLanguage = (lng: string) => {
    return i18n?.language === lng;
  };

  return { t, changeLanguage, getCurrentLanguage, isLanguage, i18n };
};

// Fallback function for server-side rendering
export const getTranslation = (key: string, options?: { defaultValue?: string }) => {
  // This is a simple fallback for SSR - in production you'd want proper SSR i18n
  const translations: Record<string, string> = {
    'home.hero.flagship': 'ĐẶC BIỆT',
    'home.hero.title': 'Gaming Gear Chuyên Nghiệp',
    'home.hero.subtitle': 'Thiết bị gaming cao cấp cho game thủ chuyên nghiệp',
    'home.hero.explore': 'Khám phá ngay',
    // Add more translations as needed
  };

  return translations[key] || options?.defaultValue || key;
};


