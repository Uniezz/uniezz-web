import { createFileRoute } from '@tanstack/react-router';

import { ChatThread, ConversationScreen } from '@/components/features/chat';
import { useConversation, useConversations, useGoBack, usePhoneViewport } from '@/hooks';
import { UIEmpty, UIPanel } from '@/ui/components';
import { DRAFT_CHAT_ID, selectedConversationId } from '@/utils';

export const Route = createFileRoute('/_app/chat/')({ component: ChatPage });

function ChatPage() {
  const { conversationId, userId } = Route.useSearch();
  const navigate = Route.useNavigate();
  const goBack = useGoBack();
  const isPhone = usePhoneViewport();
  const isDraft = conversationId === DRAFT_CHAT_ID;
  const { data, isPending } = useConversations();
  const conversations = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const id = isDraft ? undefined : selectedConversationId(conversations, conversationId);
  const listed = conversations.find((conversation) => conversation.id === id);
  // A link can point at a chat that is not in the pages loaded so far.
  const { data: fetched, isError, refetch } = useConversation(listed ? undefined : id);
  const conversation = listed ?? fetched;
  // as the app: a chat always sits over the chat list, which Back returns to
  const handleBack = () =>
    goBack({
      to: '/chat',
      search: (previous) => ({ ...previous, conversationId: undefined, userId: undefined }),
    });

  if (isPhone) {
    return (
      <ConversationScreen
        conversation={conversation}
        userId={isDraft ? userId : undefined}
        isError={isError}
        onRetry={() => void refetch()}
        onBack={handleBack}
        // the same screen turns into the conversation, without a transition
        onCreated={(createdId) =>
          void navigate({
            search: (previous) => ({ ...previous, conversationId: createdId, userId: undefined }),
            replace: true,
          })
        }
      />
    );
  }
  if (!conversation) {
    return <UIPanel className="h-full">{!isPending && !id && <UIEmpty />}</UIPanel>;
  }
  return (
    <ChatThread
      key={conversation.id}
      conversation={conversation}
      onBack={() =>
        void navigate({
          to: '/chat',
          search: (previous) => ({ ...previous, conversationId: undefined }),
        })
      }
    />
  );
}
