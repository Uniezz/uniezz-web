import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { ChatMessageView } from '@/@types';
import { chatClock } from '@/utils';
import { ChatMessageImages } from './ChatMessageImages';
import type { ChatPreviewState } from './ChatImagePreview';

/** One message row. It is memoized, so loading older pages does not re-render the rows on screen. */
export const ChatMessageBubble = memo(function ChatMessageBubble({
  message,
  outgoing,
  onPreview,
}: {
  message: ChatMessageView;
  outgoing: boolean;
  onPreview: (preview: ChatPreviewState) => void;
}) {
  const { t, i18n } = useTranslation();
  const images = message.attachments ?? [];
  return (
    <div role="listitem" className={`flex pb-2.5 ${outgoing ? 'justify-end' : 'justify-start'}`}>
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
});
