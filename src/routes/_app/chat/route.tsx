import { createContext, useState } from 'react';
import { Outlet, createFileRoute } from '@tanstack/react-router';

import type { Conversation, Message } from '@/@types';
// TODO(api): Replace mock conversations and local chat mutations with API queries and mutations.
import { CHATMOCKS, connectionConversation, createGroupConversation } from '@/utils';
import { useConnectionsList } from '@/hooks';
import { ConversationList } from '@/components/features/chat';

// TODO(api): Remove this mock-state context when chat queries and mutations are API-backed.
export const ChatGroupRouteContext = createContext<{
  conversations: Conversation[];
  selected: string;
  panel: 'list' | 'thread';
  setPanel: (panel: 'list' | 'thread') => void;
  sendMessage: (id: string, message: Message) => void;
  onBack: () => void;
  onCreate: (name: string, members: string[], imageUrl?: string) => void;
} | null>(null);

export const Route = createFileRoute('/_app/chat')({
  component: ChatPage,
});

function ChatPage() {
  const { conversationId, chatType = 'all' } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: connectionPages } = useConnectionsList();
  const findConnection = (id: string) =>
    connectionPages?.pages
      .flatMap((page) => page.items ?? [])
      .find(({ profile }) => profile.id === id)?.profile;
  const [conversations, setConversations] = useState(() => {
    const conversations = [...CHATMOCKS.initialConversations];
    if (
      !conversationId ||
      conversations.some((conversation) => conversation.id === conversationId)
    ) {
      return conversations;
    }
    const extra = CHATMOCKS.extraConversations.find(
      (conversation) => conversation.id === conversationId,
    );
    const connection = findConnection(conversationId);
    if (extra) {
      conversations.push(
        connection?.avatarUrl ? { ...extra, imageUrl: connection.avatarUrl } : extra,
      );
    } else if (connection) {
      conversations.push(connectionConversation(connection));
    }
    return conversations;
  });
  const selected =
    conversations.find((conversation) => conversation.id === conversationId)?.id ??
    CHATMOCKS.initialConversations[0].id;
  const [panel, setPanel] = useState<'list' | 'thread'>(() =>
    conversations.some((conversation) => conversation.id === conversationId) ? 'thread' : 'list',
  );
  function openConversation(id: string): void {
    const person = findConnection(id);
    setConversations((conversations) => {
      if (conversations.some((conversation) => conversation.id === id)) {
        return conversations.map((conversation) =>
          conversation.id === id ? { ...conversation, unread: 0 } : conversation,
        );
      }
      return person ? [...conversations, connectionConversation(person)] : conversations;
    });
    setPanel('thread');
    void navigate({ search: (previous) => ({ ...previous, conversationId: id }) });
  }
  function createGroup(name: string, members: string[], imageUrl?: string): void {
    const group = createGroupConversation(conversations, name, members, imageUrl);
    setConversations((conversations) => [...conversations, group]);
    setPanel('thread');
    void navigate({
      to: '/chat',
      search: (previous) => ({
        ...previous,
        conversationId: group.id,
      }),
    });
  }
  function sendMessage(id: string, message: Message): void {
    setConversations((conversations) =>
      conversations.map((conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              preview: message.text,
              messages: [...conversation.messages, message],
            }
          : conversation,
      ),
    );
  }
  return (
    <ChatGroupRouteContext.Provider
      value={{
        conversations,
        selected,
        panel,
        setPanel,
        sendMessage,
        onBack: () => {
          setPanel('list');
          void navigate({
            to: '/chat',
          });
        },
        onCreate: createGroup,
      }}
    >
      <div className="grid h-[calc(100svh-150px)] min-h-[540px] gap-5 md:h-[calc(100svh-120px)] md:grid-cols-[300px_minmax(0,1fr)] lg:-ml-3 lg:h-[calc(100svh-56px)] lg:grid-cols-[340px_minmax(0,1fr)]">
        <ConversationList
          conversations={conversations}
          selected={selected}
          filter={chatType}
          hidden={panel !== 'list'}
          onFilterChange={(chatType) =>
            void navigate({
              search: (previous) => ({
                chatType: chatType === 'all' ? undefined : chatType,
                ...(previous.conversationId ? { conversationId: previous.conversationId } : {}),
              }),
            })
          }
          onNewGroup={() => {
            setPanel('thread');
            void navigate({
              to: '/chat/new-group',
            });
          }}
          onOpen={openConversation}
        />
        <div className={`${panel === 'list' ? 'hidden md:block' : 'block'} min-h-0`}>
          <Outlet />
        </div>
      </div>
    </ChatGroupRouteContext.Provider>
  );
}
