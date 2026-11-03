import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { UIEmpty, UITopbar } from '@/ui/components';

export const Route = createFileRoute('/_app/faq')({ component: FAQPage });

function FAQPage() {
  const { t } = useTranslation();

  return (
    <div>
      <UITopbar title={t('faq.title')} />
      <UIEmpty>{t('faq.empty')}</UIEmpty>
    </div>
  );
}
