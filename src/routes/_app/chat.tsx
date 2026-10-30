import { createFileRoute } from '@tanstack/react-router';
import { Activity, useState } from 'react';

import type { ChatView, Message } from '@/@types';
import { UIPanel } from '@/ui/components';
import { CHATMOCKS, createGroupConversation, optionalSearchString } from '@/utils';
import { CreateGroup, ConversationList, ChatThread } from '@/components/features/chat';

export const Route = createFileRoute('/_app/chat')({
  validateSearch: (search: Record<string, unknown>): { recipient?: string } => ({
    recipient: optionalSearchString(search.recipient),
  }),
  component: ChatPage,
  remountDeps: ({ search }) => search.recipient,
});

function ChatPage() {
  const { recipient } = Route.useSearch();
  const [conversations, setConversations] = useState(() => [
    ...CHATMOCKS.initialConversations,
    ...CHATMOCKS.extraConversations.filter((conversation) => conversation.name === recipient),
  ]);
  const [{ selected, panel }, setView] = useState<ChatView>(() => ({
    selected:
      conversations.find((conversation) => conversation.name === recipient)?.name ??
      CHATMOCKS.initialConversations[0].name,
    panel: recipient ? 'thread' : 'list',
  }));

  function openConversation(name: string): void {
    setConversations((conversations) =>
      conversations.map((conversation) =>
        conversation.name === name ? { ...conversation, unread: 0 } : conversation,
      ),
    );
    setView({ selected: name, panel: 'thread' });
  }
  function createGroup(name: string, members: string[], imageUrl?: string): void {
    const group = createGroupConversation(conversations, name, members, imageUrl);
    setConversations((conversations) => [...conversations, group]);
    setView({ selected: group.name, panel: 'thread' });
  }
  function sendMessage(name: string, message: Message): void {
    setConversations((conversations) =>
      conversations.map((conversation) =>
        conversation.name === name
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
        hidden={panel !== 'list'}
        onNewGroup={() => setView((view) => ({ ...view, panel: 'group' }))}
        onOpen={openConversation}
      />
      <div className={`${panel === 'group' ? 'block' : 'hidden'} min-h-0`}>
        {panel === 'group' && (
          <UIPanel className="flex h-full min-h-0 flex-col overflow-hidden p-5 sm:p-8">
            <CreateGroup
              onBack={() => setView((view) => ({ ...view, panel: 'list' }))}
              onCreate={createGroup}
            />
          </UIPanel>
        )}
      </div>
      <div
        className={`${panel === 'list' ? 'hidden md:block' : panel === 'group' ? 'hidden' : 'block'} min-h-0`}
      >
        {conversations.map((conversation) => (
          <Activity
            key={conversation.name}
            mode={conversation.name === selected ? 'visible' : 'hidden'}
          >
            <ChatThread
              current={conversation}
              onBack={() => setView((view) => ({ ...view, panel: 'list' }))}
              onSend={(message) => sendMessage(conversation.name, message)}
            />
          </Activity>
        ))}
      </div>
    </div>
  );
}
