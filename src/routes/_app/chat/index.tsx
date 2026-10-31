import { Activity, useContext } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { ChatThread } from '@/components/features/chat';
// TODO(api): Render the selected conversation from API data instead of mock-state context.
import { ChatGroupRouteContext } from './route';

export const Route = createFileRoute('/_app/chat/')({ component: ChatPage });

function ChatPage() {
  const context = useContext(ChatGroupRouteContext);
  if (!context) return null;

  return context.conversations.map((conversation) => (
    <Activity
      key={conversation.id}
      mode={conversation.id === context.selected ? 'visible' : 'hidden'}
    >
      <ChatThread
        current={conversation}
        onBack={() => context.setPanel('list')}
        onSend={(message) => context.sendMessage(conversation.id, message)}
      />
    </Activity>
  ));
}
