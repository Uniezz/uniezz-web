import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/** Syncs `html[lang]` and refreshes route `head` when the UI language changes. */
export function DocumentLang() {
  const { i18n } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? 'en';
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    const onLanguageChanged = () => {
      router.invalidate();
    };
    i18n.on('languageChanged', onLanguageChanged);
    return () => i18n.off('languageChanged', onLanguageChanged);
  }, [i18n, router]);

  return null;
}
