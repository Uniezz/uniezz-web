import { createFileRoute } from '@tanstack/react-router';

import { CreateGroup } from '@/components/features/chat';
import { UIPanel } from '@/ui/components';

export const Route = createFileRoute('/_app/chat/new-group')({ component: NewGroupPage });

function NewGroupPage() {
  const navigate = Route.useNavigate();
  return (
    <UIPanel className="flex h-full min-h-0 flex-col overflow-hidden p-5 sm:p-8">
      <CreateGroup
        onBack={() =>
          void navigate({
            to: '/chat',
            search: (previous) => ({ ...previous, conversationId: undefined }),
          })
        }
        onCreated={(conversationId) =>
          void navigate({ to: '/chat', search: (previous) => ({ ...previous, conversationId }) })
        }
      />
    </UIPanel>
  );
}
