import { Ban, Check, Clock } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { ChatMessageView } from '@/@types';
import { useChatMessageMenu } from '@/hooks/useChatMessageMenu';
import { UIAvatar } from '@/ui/components/UIAvatar';
import { UIContextMenu } from '@/ui/components/UIContextMenu';
import { cn } from '@/ui/cn';
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
  onReport: (message: ChatMessageView) => void;
  onDelete: (message: ChatMessageView) => void;
};

/** One message row. It is memoized, so loading older pages does not re-render the rows on screen. */
export const ChatMessageBubble = memo(function ChatMessageBubble({
  message,
  outgoing,
  position,
  isGroup,
  onPreview,
  onReport,
  onDelete,
}: ChatMessageBubbleProps) {
  const { t, i18n } = useTranslation();
  const { sender, body, status } = message;
  const { options, selectAction } = useChatMessageMenu(message, outgoing, onReport, onDelete);

  const isDeleted = message.deletedAt !== null;
  const images = message.attachments ?? [];

  const showsSender = isGroup && !outgoing && (position === 'first' || position === 'single');
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
            avatarSymbols={initials(authorName(sender))}
            aria-hidden="true"
          />
        ) : null
      }
    >
      <UIContextMenu
        options={options}
        onSelect={selectAction}
        align={outgoing ? 'end' : 'start'}
        className="group/message w-fit max-w-[80%] min-w-0"
      >
        <ChatBubble
          variant={outgoing ? 'out' : 'in'}
          tail={endsGroup && !isDeleted}
          className={cn(
            'max-w-full ring-inset group-has-[+:popover-open]/message:ring-2',
            outgoing ? 'ring-sky' : 'ring-blue',
            isDeleted && 'border-white-20 bg-transparent',
          )}
          sender={
            showsSender ? (
              <span className={senderColor(sender.id)}>
                {(!sender.deleted && authorName(sender)) || t('app.accountDeleted')}
              </span>
            ) : null
          }
          meta={
            isDeleted ? null : (
              <>
                <span>{chatClock(message.createdAt, i18n.language)}</span>
                {outgoing ? (
                  <>
                    <StatusIcon size={14} className="text-white" aria-hidden="true" />
                    <span className="sr-only">
                      {status === 'sending' ? t('chat.sending') : t('chat.sent')}
                    </span>
                  </>
                ) : null}
              </>
            )
          }
        >
          {isDeleted ? (
            <p className="flex items-center gap-2 text-label text-secondary">
              <Ban size={14} aria-hidden="true" />
              {t('chat.messageDeleted')}
            </p>
          ) : null}
          {images.length > 0 ? <ChatMessageImages images={images} onOpen={openImage} /> : null}
          {body ? <p>{body}</p> : null}
        </ChatBubble>
      </UIContextMenu>
    </ChatMessageRow>
  );
});
