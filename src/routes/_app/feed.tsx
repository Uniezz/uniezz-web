import { UITopbar } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_app/feed')({
  component: FeedPage,
});

function FeedPage() {
  const { t } = useTranslation();
  return (
    <>
      <UITopbar
        title={t('feed.title')}
        subtitle={t('feed.subtitle')}
        action={{ label: t('feed.action'), icon: Plus }}
      />
      <div className="p-8" />
    </>
  );
}
