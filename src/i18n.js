import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import pl from './locales/pl/translation.json';
import ru from './locales/ru/translation.json';
import uk from './locales/uk/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: en },
      pl: { translation: pl },
      uk: { translation: uk },
      ru: { translation: ru },
    },
  });

export default i18n;
