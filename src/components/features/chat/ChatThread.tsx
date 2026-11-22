import { useState } from 'react';

import type { ChatConversation } from '@/@types';
import { UIPanel } from '@/ui/components';
import { ChatComposer } from './ChatComposer';
import { ChatHeader } from './ChatHeader';
import { ChatImagePreview, type ChatPreviewState } from './ChatImagePreview';
import { ChatMessageList } from './ChatMessageList';

export function ChatThread({
  conversation,
  onBack,
}: {
  conversation: ChatConversation;
  onBack: () => void;
}) {
  const [preview, setPreview] = useState<ChatPreviewState | null>(null);
  return (
    <UIPanel className="flex h-full min-h-0 flex-col p-0">
      <ChatHeader conversation={conversation} onBack={onBack} />
      <ChatMessageList conversationId={conversation.id} onPreview={setPreview} />
      <ChatComposer conversationId={conversation.id} onPreview={setPreview} />
      <ChatImagePreview
        preview={preview}
        onIndexChange={(index) => setPreview((previous) => previous && { ...previous, index })}
        onClose={() => setPreview(null)}
      />
    </UIPanel>
  );
}
