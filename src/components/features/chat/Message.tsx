import { Link } from '@tanstack/react-router';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ChatMessageView } from '@/@types';
import { ReportButton } from '@/components/features/reports';
import { useLongPress } from '@/hooks';
import { cn } from '@/ui/cn';
import { UIAvatar } from '@/ui/components';
import { appChatDay, authorName, chatClock, chatMessageText, toast } from '@/utils';
import { ChatActionSheet, type ChatAction } from './ChatActionSheet';
import type { ChatPreviewState } from './ChatImagePreview';
import { MessagePhotos } from './MessagePhotos';

export type MessageProps = {
  message: ChatMessageView;
  /** the message above, so a new day gets its date line */
  previous?: ChatMessageView;
  /** the message below, so a group names the sender once, under the last of a run */
  next?: ChatMessageView;
  isMine: boolean;
  isGroup: boolean;
  /** names for the ids system messages carry */
  names?: ReadonlyMap<string, string>;
  onDelete: (message: ChatMessageView) => void;
  onPhotoError: (message: ChatMessageView) => void;
  onPreview: (preview: ChatPreviewState) => void;
};

const isSameDay = (a: string, b: string) =>
  new Date(a).toDateString() === new Date(b).toDateString();

/** Phone-only: the mobile app's Message — a bubble with its album, text and time, or a system line. */
export const Message = memo(function Message({
  message,
  previous,
  next,
  isMine,
  isGroup,
  names,
  onDelete,
  onPhotoError,
  onPreview,
}: MessageProps) {
  const { t, i18n } = useTranslation();
  const isNewDay = !previous || !isSameDay(previous.createdAt, message.createdAt);
  const isPending = message.status === 'sending';
  const isSenderShown =
    isGroup &&
    !isMine &&
    message.kind !== 'system' &&
    (!next ||
      next.kind === 'system' ||
      next.sender.id !== message.sender.id ||
      !isSameDay(next.createdAt, message.createdAt));
  const senderName = message.sender.deleted
    ? t('app.accountDeleted')
    : authorName(message.sender) || t('apiState.student');

  return (
    <div role="listitem" className="flex flex-col pb-1.5">
      {isNewDay && (
        <p className="self-center pb-2 text-micro font-medium text-secondary">
          {appChatDay(message.createdAt, i18n.language, t('feed.today'))}
        </p>
      )}
      {message.kind === 'system' ? (
        <p className="self-center px-6 text-center text-micro text-secondary">
          {chatMessageText(message, t, names)}
        </p>
      ) : (
        <>
          {isPending || message.deletedAt ? (
            <Bubble
              message={message}
              isMine={isMine}
              onPhotoError={onPhotoError}
              onPreview={onPreview}
            />
          ) : isMine ? (
            <BubbleWithMenu
              message={message}
              isMine
              onDelete={onDelete}
              onPhotoError={onPhotoError}
              onPreview={onPreview}
            />
          ) : (
            <ReportButton
              targetType="message"
              targetId={message.id}
              placement="bottom"
              renderTrigger={({ onOpen }) => (
                <BubbleWithMenu
                  message={message}
                  isMine={false}
                  onReport={onOpen}
                  onPhotoError={onPhotoError}
                  onPreview={onPreview}
                />
              )}
            />
          )}
          {isSenderShown && (
            <Link
              to="/connections/students/$profileId"
              params={{ profileId: message.sender.id ?? '' }}
              search={{ studentSearch: undefined }}
              disabled={!message.sender.id}
              data-ph-capture-attribute-label="Open message sender profile"
              className="mt-1 flex max-w-full min-w-0 items-center gap-1.5 self-start text-micro font-semibold text-secondary focus-visible:outline-2 focus-visible:outline-blue"
            >
              <UIAvatar
                size="xs"
                imgSrc={message.sender.avatarUrl ?? '/app/avatar.png'}
                alt=""
                className="shrink-0"
              />
              <span className="truncate">{senderName}</span>
            </Link>
          )}
        </>
      )}
    </div>
  );
});

type BubbleProps = {
  message: ChatMessageView;
  isMine: boolean;
  onPhotoError: (message: ChatMessageView) => void;
  onPreview: (preview: ChatPreviewState) => void;
};

/** Long press opens the menu: Copy for text, then Delete on your own message or Report on another's. */
function BubbleWithMenu({
  onDelete,
  onReport,
  ...props
}: BubbleProps & {
  onDelete?: (message: ChatMessageView) => void;
  onReport?: () => void;
}) {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const longPress = useLongPress(() => setIsMenuOpen(true));
  const { message } = props;
  const handleCopy = () =>
    void navigator.clipboard
      .writeText(message.body ?? '')
      .then(() => toast.success(t('chat.copied')))
      .catch(() => toast.error(t('apiState.error')));
  const actions: ChatAction[] = [
    ...(message.body ? [{ id: 'copy', label: t('chat.copy'), onSelect: handleCopy }] : []),
    props.isMine
      ? {
          id: 'delete',
          label: t('chat.delete'),
          destructive: true,
          onSelect: () => onDelete?.(message),
        }
      : { id: 'report', label: t('chat.report'), destructive: true, onSelect: () => onReport?.() },
  ];
  return (
    <>
      <div
        {...longPress}
        className={cn(
          'max-w-full select-none [-webkit-touch-callout:none]',
          props.isMine ? 'self-end' : 'self-start',
        )}
      >
        <Bubble {...props} />
      </div>
      <ChatActionSheet
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        title={t('app.moreOptions')}
        actions={actions}
      />
    </>
  );
}

function Bubble({ message, isMine, onPhotoError, onPreview }: BubbleProps) {
  const { t, i18n } = useTranslation();
  const photos = message.attachments ?? [];
  const hasPhotos = photos.length > 0;
  const hasText = Boolean(message.deletedAt || message.body);
  const time = chatClock(message.createdAt, i18n.language);
  const handleOpen = (index: number) =>
    onPreview({
      images: photos.map(({ url }) => ({ url, name: t('app.attachedImage') })),
      index,
    });
  const handlePhotoError = () => onPhotoError(message);
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl wrap-break-word whitespace-pre-wrap',
        isMine ? 'self-end bg-blue' : 'self-start border border-white-10 bg-surface-60',
        hasPhotos ? 'p-0.75' : 'max-w-65',
        message.status === 'sending' && 'opacity-60',
      )}
    >
      {hasPhotos && (
        <div className="relative">
          <MessagePhotos attachments={photos} onOpen={handleOpen} onError={handlePhotoError} />
          {/* a photo without text carries its time over the album, as in Telegram */}
          {!hasText && (
            <span className="absolute right-2 bottom-2 rounded-[10px] bg-ink-40 px-1.5 py-0.5 text-micro">
              {time}
            </span>
          )}
        </div>
      )}
      {hasText && (
        <div
          className={cn(
            'flex flex-col gap-0.5 pb-2',
            hasPhotos ? 'max-w-63 px-2.75 pt-1.5' : 'px-3.5 pt-2.5',
          )}
        >
          <p className={cn('text-body', message.deletedAt ? 'text-secondary' : 'text-white')}>
            {chatMessageText(message, t)}
          </p>
          <span className={cn('self-end text-micro', isMine ? 'text-white-60' : 'text-white-40')}>
            {time}
          </span>
        </div>
      )}
    </div>
  );
}
