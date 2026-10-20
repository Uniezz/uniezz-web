import { UITopbar } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';
import { Paperclip } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_app/exams')({
  component: ExamsPage,
});

function ExamsPage() {
  const { t } = useTranslation();
  return (
    <>
      <UITopbar
        title={t('exams.title')}
        subtitle={t('exams.subtitle')}
        action={{ label: 'Upload material', icon: Paperclip }}
      />
      <div className="p-8" />
    </>
  );
}
