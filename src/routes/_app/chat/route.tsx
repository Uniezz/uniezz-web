import posthog from 'posthog-js';
import { Outlet, createFileRoute, redirect, useRouterState } from '@tanstack/react-router';

import { useOpenDirectConversation, usePhoneViewport } from '@/hooks';
import { ChatListScreen, ConversationList } from '@/components/features/chat';
import { optionalSearchStringSchema } from '@/schemas';

export const Route = createFileRoute('/_app/chat')({
  // `userId`: a draft chat with a student who is not a connection, before the first message
  validateSearch: (search: Record<string, unknown>): { userId?: string } => {
    const userId = optionalSearchStringSchema.parse(search.userId);
    return userId ? { userId } : {};
  },
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
  const isPhone = usePhoneViewport();
  // new group, group settings: pushed screens over the list
  const isSubPage = useRouterState({
    select: (state) => !['/chat', '/chat/'].includes(state.location.pathname),
  });
  // On a phone, the list shows until a chat is open, as in the app. A desktop always shows both.
  const showList = !conversationId && !isSubPage;
  function openConversation(id: string): void {
    void navigate({ search: (previous) => ({ ...previous, conversationId: id }) });
  }
  if (isPhone) {
    return (
      <>
        {showList ? (
          <ChatListScreen
            filter={chatType === 'connections' ? 'all' : chatType}
            onFilterChange={(next) =>
              void navigate({ search: { chatType: next === 'all' ? undefined : next } })
            }
            onOpen={openConversation}
            onNewGroup={() => void navigate({ to: '/chat/new-group' })}
          />
        ) : (
          <Outlet />
        )}
      </>
    );
  }
  return (
    <div className="grid h-[calc(100svh-150px)] min-h-[540px] gap-5 md:h-[calc(100svh-120px)] lg:-ml-3 lg:h-[calc(100svh-56px)] lg:grid-cols-[340px_minmax(0,1fr)]">
      <ConversationList
        selected={conversationId}
        filter={chatType === 'requests' ? 'all' : chatType}
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
      <div className={`${showList ? 'max-lg:hidden' : ''} min-h-0`}>
        <Outlet />
      </div>
    </div>
  );
}
