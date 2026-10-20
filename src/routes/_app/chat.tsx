import { UITopbar } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_app/chat')({
  component: ChatPage,
});

function ChatPage() {
  const { t } = useTranslation();
  return (
    <>
      <UITopbar
        title={t('chat.title')}
        subtitle={t('chat.subtitle')}
        action={{ label: 'New group', icon: Plus }}
      />
      <div className="p-8" />
    </>
  );
}
