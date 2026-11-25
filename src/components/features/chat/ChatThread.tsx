import { useEffect, useState } from 'react';

import type { ChatConversation } from '@/@types';
import { useMarkChatRead } from '@/hooks';
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
  const { mutate: markRead } = useMarkChatRead();
  const { id, unreadCount, lastReadSeq, lastSeq } = conversation;
  // Saved once, because opening the chat marks it as read. Each chat mounts its own thread.
  const [unreadAtOpen] = useState(() => ({ count: unreadCount, lastReadSeq }));
  // Opening a chat, or getting a new message in it, marks everything up to the newest as read.
  useEffect(() => {
    if (unreadCount > 0) markRead({ conversationId: id, seq: lastSeq });
  }, [id, unreadCount, lastSeq, markRead]);
  return (
    <UIPanel className="flex h-full min-h-0 flex-col p-0">
      <ChatHeader conversation={conversation} onBack={onBack} />
      <ChatMessageList
        conversationId={conversation.id}
        unreadAtOpen={unreadAtOpen}
        onPreview={setPreview}
      />
      <ChatComposer conversationId={conversation.id} onPreview={setPreview} />
      <ChatImagePreview
        preview={preview}
        onIndexChange={(index) => setPreview((previous) => previous && { ...previous, index })}
        onClose={() => setPreview(null)}
      />
    </UIPanel>
  );
}
