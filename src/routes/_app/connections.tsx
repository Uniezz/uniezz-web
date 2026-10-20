import { UITopbar } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_app/connections')({
  component: ConnectionsPage,
});

function ConnectionsPage() {
  const { t } = useTranslation();
  return (
    <>
      <UITopbar
        title={t('connections.title')}
        subtitle={t('connections.subtitle')}
        action={{ label: t('connections.action'), icon: Pencil }}
      />
      <div className="p-8" />
    </>
  );
}
