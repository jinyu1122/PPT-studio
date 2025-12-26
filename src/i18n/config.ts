export const locales = ['en', 'zh', 'de', 'es', 'fr', 'ru', 'ja', 'ko', 'it', 'id', 'pt'] as const;
export const baseURL = 'https://ppt-studio.com';
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  it: 'Italiano',
  id: 'Bahasa Indonesia',
  pt: 'Português'
};

export const getLocaleKeys = (): string[] => {
    return Object.keys(localeNames);
}
