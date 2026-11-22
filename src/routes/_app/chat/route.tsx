import posthog from 'posthog-js';
import { Outlet, createFileRoute, redirect, useRouterState } from '@tanstack/react-router';

import { useOpenDirectConversation } from '@/hooks';
import { ConversationList } from '@/components/features/chat';

export const Route = createFileRoute('/_app/chat')({
  beforeLoad: () => {
    if (posthog.isFeatureEnabled('chat') === false) {
      throw redirect({ to: '/feed', replace: true });
    }
  },
  component: ChatPage,
});

function ChatPage() {
  const { conversationId, chatType = 'all' } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { mutate: openDirect } = useOpenDirectConversation();
  const isNewGroup = useRouterState({
    select: (state) => state.location.pathname === '/chat/new-group',
  });
  // On a phone, the list shows until a chat is open. A desktop always shows both.
  const showList = !conversationId && !isNewGroup;
  function openConversation(id: string): void {
    void navigate({ search: (previous) => ({ ...previous, conversationId: id }) });
  }
  return (
    <div className="grid h-[calc(100svh-150px)] min-h-[540px] gap-5 md:h-[calc(100svh-120px)] md:grid-cols-[300px_minmax(0,1fr)] lg:-ml-3 lg:h-[calc(100svh-56px)] lg:grid-cols-[340px_minmax(0,1fr)]">
      <ConversationList
        selected={conversationId}
        filter={chatType}
        hidden={!showList}
        onFilterChange={(chatType) =>
          void navigate({
            search: (previous) => ({
              chatType: chatType === 'all' ? undefined : chatType,
              ...(previous.conversationId ? { conversationId: previous.conversationId } : {}),
            }),
          })
        }
        onNewGroup={() => void navigate({ to: '/chat/new-group' })}
        onOpen={openConversation}
        onOpenConnection={(userId) =>
          openDirect(userId, { onSuccess: ({ id }) => openConversation(id) })
        }
      />
      <div className={`${showList ? 'hidden md:block' : 'block'} min-h-0`}>
        <Outlet />
      </div>
    </div>
  );
}
