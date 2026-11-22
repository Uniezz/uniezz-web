import { useState } from 'react';

import type { Message, Conversation } from '@/@types';
import { UIPanel } from '@/ui/components';
import { ChatComposer } from './ChatComposer';
import { ChatHeader } from './ChatHeader';
import { ChatImagePreview, type ChatPreviewState } from './ChatImagePreview';
import { ChatMessageList } from './ChatMessageList';

export function ChatThread({
  current,
  onBack,
  onSend,
}: {
  current: Conversation;
  onBack: () => void;
  onSend: (message: Message) => void;
}) {
  const [preview, setPreview] = useState<ChatPreviewState | null>(null);
  return (
    <UIPanel className="flex h-full min-h-0 flex-col p-0">
      <ChatHeader current={current} onBack={onBack} />
      <ChatMessageList current={current} onPreview={setPreview} />
      <ChatComposer onSend={onSend} onPreview={setPreview} />
      <ChatImagePreview
        preview={preview}
        onIndexChange={(index) => setPreview((previous) => previous && { ...previous, index })}
        onClose={() => setPreview(null)}
      />
    </UIPanel>
  );
}
