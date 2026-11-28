import { Link } from '@tanstack/react-router';
import { Check, Clock } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { ChatMessageView } from '@/@types';
import { UIAvatar } from '@/ui/components/UIAvatar';
import { chatClock, initials } from '@/utils/chat';
import { senderColor } from '@/utils/chatColors';
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
  /** In a group chat, incoming messages show who wrote them. */
  isGroup: boolean;
  onPreview: (preview: ChatPreviewState) => void;
};

/** One message row. It is memoized, so loading older pages does not re-render the rows on screen. */
export const ChatMessageBubble = memo(function ChatMessageBubble({
  message,
  outgoing,
  position,
  isGroup,
  onPreview,
}: ChatMessageBubbleProps) {
  const { t, i18n } = useTranslation();
  const { sender, body, status } = message;

  const images = message.attachments ?? [];

  const showsSender = isGroup && !outgoing && (position === 'first' || position === 'single');
  const endsGroup = position === 'last' || position === 'single';
  const senderName = (!sender.deleted && authorName(sender)) || t('app.accountDeleted');
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
            avatarSymbols={initials(authorName(sender))}
            aria-hidden="true"
          />
        ) : null
      }
    >
      <ChatBubble
        variant={outgoing ? 'out' : 'in'}
        tail={endsGroup}
        sender={showsSender ? <span className={senderColor(sender.id)}>{senderName}</span> : null}
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
      {/* on a phone, a group names the sender under the last message of a run, as in the app */}
      {isGroup && !outgoing && endsGroup ? (
        <Link
          to="/connections/students/$profileId"
          params={{ profileId: sender.id ?? '' }}
          search={{ studentSearch: undefined }}
          disabled={!sender.id}
          data-ph-capture-attribute-label="Open message sender profile"
          className="mt-1 flex max-w-full min-w-0 items-center gap-1.5 text-micro font-semibold text-secondary focus-visible:outline-2 focus-visible:outline-blue lg:hidden"
        >
          <UIAvatar
            size="sm"
            imgSrc={sender.avatarUrl ?? undefined}
            avatarSymbols={initials(authorName(sender))}
            className="shrink-0 *:size-6"
            aria-hidden="true"
          />
          <span className="truncate">{senderName}</span>
        </Link>
      ) : null}
    </ChatMessageRow>
  );
});
