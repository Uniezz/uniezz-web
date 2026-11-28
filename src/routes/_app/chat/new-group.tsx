import { createFileRoute } from '@tanstack/react-router';

import { CreateGroup, NewGroupScreen } from '@/components/features/chat';
import { usePhoneViewport } from '@/hooks';
import { optionalSearchStringSchema } from '@/schemas';
import { UIPanel } from '@/ui/components';

export const Route = createFileRoute('/_app/chat/new-group')({
  // `groupId`: add people to that group instead of creating one, as the app's /chat/new?groupId=
  validateSearch: (search: Record<string, unknown>): { groupId?: string } => {
    const groupId = optionalSearchStringSchema.parse(search.groupId);
    return groupId ? { groupId } : {};
  },
  component: NewGroupPage,
});

function NewGroupPage() {
  const navigate = Route.useNavigate();
  const { groupId } = Route.useSearch();
  const isPhone = usePhoneViewport();
  if (isPhone) {
    return (
      <NewGroupScreen
        groupId={groupId}
        onBack={() =>
          void (groupId
            ? navigate({ to: '/chat/group/$conversationId', params: { conversationId: groupId } })
            : navigate({
                to: '/chat',
                search: (previous) => ({ ...previous, conversationId: undefined }),
              }))
        }
        onCreated={(conversationId) =>
          void navigate({
            to: '/chat',
            search: (previous) => ({ ...previous, conversationId }),
            replace: true,
          })
        }
      />
    );
  }
  return (
    // On a phone, the form covers the page and its bottom tabs, as a pushed screen does in the app.
    <UIPanel className="flex h-full min-h-0 flex-col overflow-hidden p-5 max-lg:fixed max-lg:inset-0 max-lg:z-50 max-lg:rounded-none max-lg:border-0 max-lg:bg-ink max-lg:px-4 max-lg:pt-[max(8px,env(safe-area-inset-top))] max-lg:pb-[max(12px,env(safe-area-inset-bottom))] max-lg:before:hidden lg:p-8">
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
