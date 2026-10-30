import { createFileRoute } from '@tanstack/react-router';
import { Activity, useState } from 'react';

import type { Message } from '@/@types';
import { UIPanel } from '@/ui/components';
import { CHATMOCKS, CONNECTIONSMOCKS, createGroupConversation } from '@/utils';
import { CreateGroup, ConversationList, ChatThread } from '@/components/features/chat';

export const Route = createFileRoute('/_app/chat')({
  component: ChatPage,
});

function ChatPage() {
  const { conversationId, chatType = 'all' } = Route.useSearch();
  const navigate = Route.useNavigate();
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
    const connection = CONNECTIONSMOCKS.connections.find((person) => person.id === conversationId);
    if (extra) {
      conversations.push(
        connection ? { ...extra, imageUrl: `/app/kuQtw-${connection.image}.jpg` } : extra,
      );
    } else if (connection) {
      conversations.push({
        id: connection.id,
        name: connection.name,
        preview: '',
        time: '',
        group: false,
        unread: 0,
        image: 0,
        imageUrl: `/app/kuQtw-${connection.image}.jpg`,
        messages: [],
      });
    }
    return conversations;
  });
  const selected =
    conversations.find((conversation) => conversation.id === conversationId)?.id ??
    CHATMOCKS.initialConversations[0].id;
  const [panel, setPanel] = useState<'list' | 'thread' | 'group'>(() =>
    conversations.some((conversation) => conversation.id === conversationId) ? 'thread' : 'list',
  );
  function openConversation(id: string): void {
    const person = CONNECTIONSMOCKS.connections.find((connection) => connection.id === id);
    setConversations((conversations) => {
      if (conversations.some((conversation) => conversation.id === id)) {
        return conversations.map((conversation) =>
          conversation.id === id ? { ...conversation, unread: 0 } : conversation,
        );
      }
      return person
        ? [
            ...conversations,
            {
              id: person.id,
              name: person.name,
              preview: '',
              time: '',
              group: false,
              unread: 0,
              image: 0,
              imageUrl: `/app/kuQtw-${person.image}.jpg`,
              messages: [],
            },
          ]
        : conversations;
    });
    setPanel('thread');
    void navigate({ search: (previous) => ({ ...previous, conversationId: id }) });
  }
  function createGroup(name: string, members: string[], imageUrl?: string): void {
    const group = createGroupConversation(conversations, name, members, imageUrl);
    setConversations((conversations) => [...conversations, group]);
    setPanel('thread');
    void navigate({ search: (previous) => ({ ...previous, conversationId: group.id }) });
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
        onNewGroup={() => setPanel('group')}
        onOpen={openConversation}
      />
      <div className={`${panel === 'group' ? 'block' : 'hidden'} min-h-0`}>
        {panel === 'group' && (
          <UIPanel className="flex h-full min-h-0 flex-col overflow-hidden p-5 sm:p-8">
            <CreateGroup onBack={() => setPanel('list')} onCreate={createGroup} />
          </UIPanel>
        )}
      </div>
      <div
        className={`${panel === 'list' ? 'hidden md:block' : panel === 'group' ? 'hidden' : 'block'} min-h-0`}
      >
        {conversations.map((conversation) => (
          <Activity
            key={conversation.id}
            mode={conversation.id === selected ? 'visible' : 'hidden'}
          >
            <ChatThread
              current={conversation}
              onBack={() => setPanel('list')}
              onSend={(message) => sendMessage(conversation.id, message)}
            />
          </Activity>
        ))}
      </div>
    </div>
  );
}
