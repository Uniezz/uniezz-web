import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';

import type { ChatConversation, ChatMessageView } from '@/@types';
import {
  useChatMembers,
  useChatMessageList,
  useCreateChatRequest,
  useDeleteChatMessage,
  useMarkChatRead,
  useMyProfile,
  usePublicProfile,
  useRefreshChatPhotos,
  useSendMessage,
  useUploadImage,
} from '@/hooks';
import { UIAvatar, UIButton, UIEmpty, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import {
  apiErrorKey,
  authorName,
  CHAT_MESSAGE_MAX_LENGTH,
  CHAT_SKELETON_BUBBLES,
  chatTitle,
  isOwnMessage,
  LATEST_MESSAGE,
  messageKey,
  toast,
} from '@/utils';
import { ChatConfirm } from './ChatConfirm';
import { ChatImagePreview, type ChatPreviewState } from './ChatImagePreview';
import { ChatRequestBar } from './ChatRequestBar';
import type { DraftPhoto } from './DraftPhotos';
import { Message } from './Message';
import { MessageComposer } from './MessageComposer';

type ComposerValues = { text: string; photos: DraftPhoto[] };

const NO_UNREAD = { count: 0, lastReadSeq: 0 };

// the space under the newest message, so it clears the composer floating over the list
const threadComponents = {
  ...listComponents,
  Footer: () => <div className="h-(--composer-space)" />,
};

/**
 * Phone-only: the mobile app's conversation screen. Without a conversation, a draft for `userId`: the
 * first message goes out as a message request, then the screen becomes that conversation.
 */
export function ConversationScreen({
  conversation,
  userId,
  isError,
  onRetry,
  onBack,
  onCreated,
}: {
  conversation: ChatConversation | undefined;
  userId?: string;
  isError: boolean;
  onRetry: () => void;
  onBack: () => void;
  onCreated: (conversationId: string) => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isDraft = Boolean(userId) && !conversation;
  const { data: me } = useMyProfile();
  const { data: student } = usePublicProfile(userId ?? '', isDraft);
  const id = conversation?.id ?? '';
  const isGroup = conversation?.kind === 'group';
  const { data: memberPage } = useChatMembers(id, isGroup);
  const names = new Map(
    (memberPage?.items ?? []).flatMap(({ student: member }) =>
      member.id ? [[member.id, authorName(member) || t('apiState.student')] as const] : [],
    ),
  );
  const [preview, setPreview] = useState<ChatPreviewState | null>(null);
  const [deleting, setDeleting] = useState<ChatMessageView | null>(null);
  const [composerHeight, setComposerHeight] = useState(0);
  const [composer, setComposer] = useState<HTMLDivElement | null>(null);
  const { mutate: markRead } = useMarkChatRead();
  const { mutate: send } = useSendMessage();
  const { mutateAsync: uploadImage } = useUploadImage('chat');
  const { mutateAsync: createRequest, isPending: isCreatingRequest } = useCreateChatRequest();
  const { mutate: deleteMessage, isPending: isDeleting } = useDeleteChatMessage(id);
  const refreshPhotos = useRefreshChatPhotos();
  const { messages, firstItemIndex, isPending, isLoaded, loadOlderMessages, followNewMessages } =
    useChatMessageList(id, NO_UNREAD, { withSystem: true });
  const { control, setValue, reset, getValues } = useForm<ComposerValues>({
    defaultValues: { text: '', photos: [] },
  });
  const [text, photos] = useWatch({ control, name: ['text', 'photos'] });
  const isValid =
    (text.trim().length > 0 || photos.length > 0) && text.length <= CHAT_MESSAGE_MAX_LENGTH;
  // a message request: the recipient answers first; the sender has one text message, then waits
  const isRequestBlocking =
    conversation?.status === 'pending' &&
    (conversation.incoming === true || conversation.lastSeq > 0);

  // an open thread is read up to its newest message, on entering and as each new one arrives
  const lastSeq = conversation?.lastSeq ?? 0;
  const isBehind = conversation ? conversation.lastReadSeq < lastSeq : false;
  useEffect(() => {
    if (isBehind) markRead({ conversationId: id, seq: lastSeq });
  }, [id, lastSeq, isBehind, markRead]);

  // the thread leaves room under its newest message for the composer floating over it
  useEffect(() => {
    if (!composer) return;
    const observer = new ResizeObserver(([entry]) =>
      setComposerHeight(entry?.borderBoxSize[0]?.blockSize ?? composer.offsetHeight),
    );
    observer.observe(composer);
    return () => observer.disconnect();
  }, [composer]);

  const title = conversation
    ? chatTitle(conversation, t('app.accountDeleted'))
    : authorName(student) || t('apiState.student');
  const avatar = conversation?.peer?.avatarUrl ?? student?.avatarUrl ?? '/app/avatar.png';

  // a group opens its members and settings; a direct chat opens the other student's profile
  const handleHeaderClick = () => {
    if (conversation?.kind === 'group') {
      void navigate({ to: '/chat/group/$conversationId', params: { conversationId: id } });
      return;
    }
    const peerId = conversation?.peer?.id ?? userId;
    if (!peerId) return;
    if (peerId === me?.id) void navigate({ to: '/profile' });
    else
      void navigate({
        to: '/connections/students/$profileId',
        params: { profileId: peerId },
        search: { studentSearch: undefined },
      });
  };

  const handleSend = async () => {
    const values = getValues();
    const body = values.text.trim();
    if (userId && !conversation) {
      try {
        const { id: createdId } = await createRequest({ userId, body });
        reset();
        onCreated(createdId);
      } catch (error) {
        toast.error(t(apiErrorKey(error)));
      }
      return;
    }
    // the field clears at once; a failed send puts the text and photos back
    reset();
    const restore = (error: unknown) => {
      reset(values);
      toast.error(t(apiErrorKey(error)));
    };
    try {
      const attachmentIds = await Promise.all(
        values.photos.map(async ({ file }) => (await uploadImage(file)).mediaId),
      );
      send(
        {
          conversationId: id,
          body: body || undefined,
          attachmentIds: attachmentIds.length ? attachmentIds : undefined,
          clientId: crypto.randomUUID(),
        },
        {
          onSuccess: () => values.photos.forEach(({ url }) => URL.revokeObjectURL(url)),
          onError: restore,
        },
      );
    } catch (error) {
      restore(error);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleting) return;
    deleteMessage(deleting.id, {
      onSuccess: () => setDeleting(null),
      onError: (error) => toast.error(t(apiErrorKey(error))),
    });
  };
  const handleDeleteOpenChange = (open: boolean) => {
    if (!open) setDeleting(null);
  };
  const handlePhotoError = (message: ChatMessageView) =>
    void refreshPhotos(message).catch(() => undefined);
  const handleOpenDraftPhoto = (index: number) =>
    setPreview({ images: photos.map(({ url, file }) => ({ url, name: file.name })), index });

  const isEmpty = !isError && (isDraft || isLoaded) && messages.length === 0;

  return (
    <div
      data-hide-bottom-tabs
      className="fixed inset-0 z-50 flex flex-col gap-3 bg-ink px-4 pt-[max(8px,env(safe-area-inset-top))]"
    >
      <div className="flex h-11 shrink-0 items-center gap-2.5">
        <UIButton
          size="square"
          bg="glass"
          aria-label={t('app.back')}
          data-ph-capture-attribute-label="Go back"
          onClick={onBack}
          className="size-11"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </UIButton>
        {conversation || isDraft ? (
          <button
            type="button"
            aria-label={title}
            data-ph-capture-attribute-label={isGroup ? 'Open group settings' : 'Open chat profile'}
            onClick={handleHeaderClick}
            className="flex min-w-0 flex-1 items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-blue"
          >
            <UIAvatar size="mobileSm" imgSrc={avatar} alt="" className="shrink-0" />
            <span className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="truncate text-base font-semibold">{title}</span>
              {isGroup && (
                <span className="text-micro text-secondary">
                  {t('chat.members', { count: conversation.memberCount ?? 0 })}
                </span>
              )}
            </span>
          </button>
        ) : (
          // the avatar and the name, until the conversation loads
          <div aria-hidden="true" className="flex flex-1 items-center gap-2.5">
            <span className="size-8 animate-pulse rounded-full bg-white-10" />
            <span className="h-4 w-35 animate-pulse rounded-lg bg-white-10" />
          </div>
        )}
      </div>
      <div className="relative -mx-4 min-h-0 flex-1" role="log" aria-label={t('app.messages')}>
        {isError ? (
          <div className="px-4">
            <UIQueryError retry={onRetry} />
          </div>
        ) : !isDraft && (isPending || !conversation) ? (
          <ConversationSkeleton bottom={composerHeight} />
        ) : (
          <Virtuoso
            data={messages}
            firstItemIndex={firstItemIndex}
            rangeChanged={loadOlderMessages}
            computeItemKey={messageKey}
            initialTopMostItemIndex={LATEST_MESSAGE}
            alignToBottom
            followOutput={followNewMessages}
            components={threadComponents}
            style={{ '--composer-space': `${composerHeight + 8}px` } as CSSProperties}
            className="scrollbar-hidden h-full"
            itemContent={(itemIndex, message) => {
              const index = itemIndex - firstItemIndex;
              return (
                <div className="px-4">
                  <Message
                    message={message}
                    previous={messages[index - 1]}
                    next={messages[index + 1]}
                    isMine={isOwnMessage(message, me?.id)}
                    isGroup={isGroup}
                    names={names}
                    onDelete={setDeleting}
                    onPhotoError={handlePhotoError}
                    onPreview={setPreview}
                  />
                </div>
              );
            }}
          />
        )}
        {/* the cat centres on the screen; a draft shows the request's rule instead */}
        {isEmpty && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-center"
            style={{ bottom: composerHeight }}
          >
            <UIEmpty>
              <p>{isDraft ? t('chat.requestFirstMessage', { name: title }) : t('app.empty')}</p>
            </UIEmpty>
          </div>
        )}
        {!isError && (
          // over the list's bottom, so messages scroll on under it
          <div
            ref={setComposer}
            className="absolute inset-x-0 bottom-0 px-4 pb-[max(12px,env(safe-area-inset-bottom))]"
          >
            {!conversation && !isDraft ? (
              <div aria-hidden="true" className="h-11 animate-pulse rounded-[22px] bg-white-10" />
            ) : conversation && isRequestBlocking ? (
              <ChatRequestBar conversation={conversation} onDeclined={onBack} />
            ) : (
              <MessageComposer
                text={text}
                onTextChange={(next) => setValue('text', next)}
                photos={photos}
                onPhotosChange={(next) => setValue('photos', next)}
                isAttachHidden={isDraft}
                isSendDisabled={!isValid || isCreatingRequest}
                onSend={() => void handleSend()}
                onOpenPhoto={handleOpenDraftPhoto}
              />
            )}
          </div>
        )}
      </div>
      <ChatConfirm
        open={deleting !== null}
        onOpenChange={handleDeleteOpenChange}
        title={t('chat.deleteMessageTitle')}
        description={t('chat.deleteMessageDescription')}
        confirmLabel={t('app.remove')}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
      />
      <ChatImagePreview
        preview={preview}
        onIndexChange={(index) => setPreview((previous) => previous && { ...previous, index })}
        onClose={() => setPreview(null)}
      />
    </div>
  );
}

/** The mobile app's ChatThreadSkeleton: six plain 56px bubbles above the composer, mine on the right. */
function ConversationSkeleton({ bottom }: { bottom: number }) {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      aria-label={t('apiState.loading')}
      className="flex h-full flex-col justify-end gap-1.5 px-4"
      style={{ paddingBottom: bottom + 8 }}
    >
      {CHAT_SKELETON_BUBBLES.map(({ isMine, width }, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={`h-14 animate-pulse rounded-2xl bg-white-10 ${isMine ? 'self-end' : 'self-start'}`}
          style={{ width }}
        />
      ))}
    </div>
  );
}
