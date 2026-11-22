import { createFileRoute } from '@tanstack/react-router';

import { ChatThread } from '@/components/features/chat';
import { useConversation, useConversations } from '@/hooks';
import { UIEmpty, UIPanel } from '@/ui/components';
import { selectedConversationId } from '@/utils';

export const Route = createFileRoute('/_app/chat/')({ component: ChatPage });

function ChatPage() {
  const { conversationId } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isPending } = useConversations();
  const conversations = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const id = selectedConversationId(conversations, conversationId);
  const listed = conversations.find((conversation) => conversation.id === id);
  // A link can point at a chat that is not in the pages loaded so far.
  const { data: fetched } = useConversation(listed ? undefined : id);
  const conversation = listed ?? fetched;

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
