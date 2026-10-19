import { UITopbar } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

export const Route = createFileRoute('/_app/chat')({
  component: ChatPage,
});

function ChatPage() {
  return (
    <>
      <UITopbar
        title="Chat"
        subtitle="Direct messages and group chats"
        action={{ label: 'New group', icon: Plus }}
      />
      <div className="p-8" />
    </>
  );
}
