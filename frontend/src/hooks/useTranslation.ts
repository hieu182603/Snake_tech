import { useTranslation as useI18nextTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t } = useI18nextTranslation();

  return { t };
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


