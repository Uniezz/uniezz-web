import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          chat: {
            title: "Chat",
            subtitle: "Direct messages and group chats"
          },
          connections: {
            title: "Connections",
            subtitle: "Meet students across all five universities"
          },
          exams: {
            title: "Exams & Courses",
            subtitle: "Past papers, course reviews and professor ratings"
          },
          feed: {
            title: "Feed",
            subtitle: "What's happening across Lublin"
          },
          guide: {
            title: "Student Guide",
            subtitle: "Everything you need to live in Lublin"
          }
        }
      }
    }
  });

export default i18n;
