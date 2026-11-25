import { Check, Clock } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { ChatMessageView } from '@/@types';
import { UIAvatar } from '@/ui/components/UIAvatar';
import { chatClock } from '@/utils/chat';
import type { ChatMessagePosition } from '@/utils/chatGroups';
import { authorName } from '@/utils/feed';
import { ChatBubble } from './ChatBubble';
import type { ChatPreviewState } from './ChatImagePreview';
import { ChatMessageImages } from './ChatMessageImages';
import { ChatMessageRow } from './ChatMessageRow';

export type ChatMessageBubbleProps = {
  message: ChatMessageView;
  outgoing: boolean;
  position: ChatMessagePosition;
  onPreview: (preview: ChatPreviewState) => void;
};

/** One message row. It is memoized, so loading older pages does not re-render the rows on screen. */
export const ChatMessageBubble = memo(function ChatMessageBubble({
  message,
  outgoing,
  position,
  onPreview,
}: ChatMessageBubbleProps) {
  const { t, i18n } = useTranslation();
  const { sender, body, status } = message;

  const images = message.attachments ?? [];

  const endsGroup = position === 'last' || position === 'single';
  const StatusIcon = status === 'sending' ? Clock : Check;

  const openImage = (index: number) =>
    onPreview({
      images: images.map(({ url }) => ({ url, name: t('app.attachedImage') })),
      index,
    });

  return (
    <ChatMessageRow
      align={outgoing ? 'end' : 'start'}
      position={position}
      avatar={
        endsGroup ? (
          <UIAvatar
            size="sm"
            imgSrc={sender.avatarUrl ?? undefined}
            avatarSymbols={authorName(sender).slice(0, 2)}
            aria-hidden="true"
          />
        ) : null
      }
    >
      <ChatBubble
        variant={outgoing ? 'out' : 'in'}
        tail={endsGroup}
        meta={
          <>
            <span>{chatClock(message.createdAt, i18n.language)}</span>
            {outgoing ? (
              <>
                <StatusIcon size={12} aria-hidden="true" />
                <span className="sr-only">
                  {status === 'sending' ? t('chat.sending') : t('chat.sent')}
                </span>
              </>
            ) : null}
          </>
        }
      >
        {images.length > 0 ? <ChatMessageImages images={images} onOpen={openImage} /> : null}
        {body ? <p>{body}</p> : null}
      </ChatBubble>
    </ChatMessageRow>
  );
});
