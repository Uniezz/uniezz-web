import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { FaqList } from '@/components/features/faq';
import { UITopbar } from '@/ui/components';

export const Route = createFileRoute('/_app/faq')({ component: FAQPage });

function FAQPage() {
  const { t } = useTranslation();

  return (
    <div className="flex h-[calc(100svh-136px)] min-h-0 flex-col lg:h-[calc(100svh-56px)]">
      <UITopbar title={t('faq.title')} />
      <FaqList />
    </div>
  );
}
