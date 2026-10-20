import { UITopbar } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_app/guide')({
  component: GuidePage,
});

function GuidePage() {
  const { t } = useTranslation();
  return (
    <>
      <UITopbar
        title={t('guide.title')}
        subtitle={t('guide.subtitle')}
        action={{ label: 'Suggest a place', icon: MapPin }}
      />
      <div className="p-8" />
    </>
  );
}
