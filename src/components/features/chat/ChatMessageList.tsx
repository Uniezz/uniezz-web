import { useTranslation } from 'react-i18next';

import { useMessages, useMyProfile } from '@/hooks';
import { UIEmpty, UIQueryError } from '@/ui/components';
import { chatClock, isOwnMessage } from '@/utils';
import { ChatMessageImages } from './ChatMessageImages';
import type { ChatPreviewState } from './ChatImagePreview';

export function ChatMessageList({
  conversationId,
  onPreview,
}: {
  conversationId: string;
  onPreview: (preview: ChatPreviewState) => void;
}) {
  const { t, i18n } = useTranslation();
  const { data: me } = useMyProfile();
  const { data, isPending, isError, refetch } = useMessages(conversationId);
  // Pages are newest first, but the thread reads oldest first. System and deleted messages come with W4.
  const messages = (data?.pages.flatMap((page) => page.items ?? []) ?? [])
    .filter(({ kind, deletedAt }) => kind === 'text' && !deletedAt)
    .reverse();
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-end overflow-auto px-7 py-5">
      <div className="space-y-2.5 overflow-auto" role="log" aria-label={t('app.messages')}>
        {messages.map((message) => {
          const outgoing = isOwnMessage(message, me?.id);
          const images = message.attachments ?? [];
          return (
            <div
              key={message.clientId ?? message.id}
              className={`flex motion-safe:animate-rise-in ${outgoing ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-story px-3.5 py-2.5 text-body leading-[1.4] md:max-w-[420px] ${outgoing ? 'rounded-br-[6px] bg-blue' : 'rounded-bl-[6px] border border-white-10 bg-white-10'}`}
              >
                {images.length > 0 && (
                  <ChatMessageImages
                    images={images}
                    onOpen={(index) =>
                      onPreview({
                        images: images.map(({ url }) => ({ url, name: t('app.attachedImage') })),
                        index,
                      })
                    }
                  />
                )}
                {message.body && <p className="break-words whitespace-pre-wrap">{message.body}</p>}
                <span
                  className={`mt-1 block text-right text-caption ${outgoing ? 'text-white-80' : 'text-secondary'}`}
                >
                  {chatClock(message.createdAt, i18n.language)}
                </span>
              </div>
            </div>
          );
        })}
        {!isPending && !isError && messages.length === 0 && <UIEmpty />}
        {isError && <UIQueryError retry={() => void refetch()} />}
      </div>
    </div>
  );
}
