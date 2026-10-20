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
          },
          auth: {
            backToUniversities: "Back to universities",
            terms: "By continuing you agree to the Terms of Use and Privacy Policy · GDPR",
            brand: {
              headline: "One platform for every student in Lublin.",
              description:
                "Five universities, one account. Sign in with the credentials you already use — your password stays on your university's own page.",
              verifiedTitle: "Verified students only",
              verifiedText: "Every account is checked against the university directory before it goes live.",
              communityTitle: "Feed, chat and connections",
              communityText: "Meet people across UMCS, KUL, Politechnika, Przyrodniczy and WSEI.",
              examsTitle: "Exams and course reviews",
              examsText: "A shared archive of past papers, syllabi and honest professor ratings.",
              privacy: "Uniezz never sees or stores your university password."
            },
            login: {
              title: "Sign in to Uniezz",
              subtitle: "Choose your university — you'll finish signing in on its own login page.",
              yourUniversity: "YOUR UNIVERSITY",
              continueWith: "Continue with {{provider}}",
              notice: "Only active students of the five Lublin universities can create an account. Staff and alumni accounts are rejected.",
            },
            usos: {
              title: "Continue with UMCS",
              subtitle: "You'll finish signing in on UMCS's own USOS page. Uniezz never sees your password.",
              open: "Open USOS login",
              notice: "UMCS students sign in on USOS. We only receive the identity USOS sends back."
            },
            otp: {
              emailTitle: "Provide your university email",
              emailSubtitle: "We'll send a six-digit code to this inbox. Use the address your university issued.",
              codeTitle: "Check your university inbox",
              codeSubtitle: "We sent a six-digit code to {{email}}. It expires in 10 minutes.",
              emailLabel: "Email",
              emailPlaceholder: "you@university.edu",
              codeLabel: "6-digit verification code",
              send: "Send code",
              verify: "Verify and continue",
              didntGetIt: "Didn't get it?",
              resendIn: "Resend in {{time}}",
              resend: "Resend code",
              codesPerHour: "3 codes per hour",
              notice: "Email sign-in confirms your university domain only. Faculty and year of study stay self-declared until your account is linked to USOS or your university directory."
            }
          }
        }
      }
    }
  });

export default i18n;
