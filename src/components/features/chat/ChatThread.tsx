import { captureAnalytics, toast, trackLocalAction } from '@/utils';
import { ArrowLeft, Paperclip, Send } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { Message, MessageAttachment, Conversation } from '@/@types';
import { cn } from '@/ui/cn';
import { UIAvatar, UIButton, UIEmojiPicker, UIEmpty, UIPanel } from '@/ui/components';
import {
  MAX_CHAT_ATTACHMENTS,
  chatAttachmentAccept,
  chatAttachmentSchema,
  isChatImage,
  textFormSchema,
  type TextFormSchema,
} from '@/schemas';
import { useUploadImage } from '@/hooks';
// TODO(api): Replace mock chat status and context content with API-backed conversation data.
import { CHATMOCKS } from '@/utils';
import { ChatDraftAttachments, type ChatDraftAttachment } from './ChatDraftAttachments';
import { ChatFileChip } from './ChatFileChip';
import { ChatImagePreview, type ChatPreviewState } from './ChatImagePreview';
import { ChatMessageImages } from './ChatMessageImages';

export function ChatThread({
  current,
  onBack,
  onSend,
}: {
  current: Conversation;
  onBack: () => void;
  onSend: (message: Message) => void;
}) {
  const { t } = useTranslation();
  const { register, control, handleSubmit, reset } = useForm<TextFormSchema>({
    resolver: zodResolver(textFormSchema),
    defaultValues: { text: '' },
    mode: 'onChange',
  });
  const [isMultiline, setIsMultiline] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [drafts, setDrafts] = useState<ChatDraftAttachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [preview, setPreview] = useState<ChatPreviewState | null>(null);
  const { mutateAsync: uploadImage } = useUploadImage('chat');
  const messageDraft = useWatch({ control, name: 'text' });
  const hasContent = Boolean(messageDraft?.trim()) || drafts.length > 0;

  function addAttachments(files: File[]) {
    if (!files.length) return;
    if (files.some((file) => !chatAttachmentSchema.safeParse(file).success)) {
      toast.error(t('app.attachmentError'));
      return;
    }
    if (drafts.length + files.length > MAX_CHAT_ATTACHMENTS) {
      toast.error(t('app.attachmentLimit', { max: MAX_CHAT_ATTACHMENTS }));
      return;
    }
    setDrafts((previous) => [
      ...previous,
      ...files.map((file) => ({ id: crypto.randomUUID(), file, url: URL.createObjectURL(file) })),
    ]);
  }

  function removeAttachment(id: string) {
    const removed = drafts.find((draft) => draft.id === id);
    if (removed) URL.revokeObjectURL(removed.url);
    setDrafts((previous) => previous.filter((draft) => draft.id !== id));
  }

  // TODO(api): Send the uploaded mediaIds with the message through the chat API once it exists.
  // TODO(api): Upload files too once the chat upload kind accepts them; they stay local for now.
  async function sendMessage(text: string) {
    setIsSending(true);
    try {
      const mediaIds = await Promise.all(
        drafts.map(async ({ file }) =>
          isChatImage(file) ? (await uploadImage(file)).mediaId : undefined,
        ),
      );
      onSend({
        text,
        outgoing: true,
        time: new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(
          new Date(),
        ),
        attachments: drafts.length
          ? drafts.map(({ file, url }, index) => ({
              name: file.name,
              url,
              size: file.size,
              contentType: file.type,
              mediaId: mediaIds[index],
            }))
          : undefined,
      });
      setDrafts([]);
      reset({ text: '' });
      setIsMultiline(false);
    } catch (error) {
      console.error('Chat attachment upload failed', error);
      toast.error(t('app.attachmentUploadError'));
    } finally {
      setIsSending(false);
    }
  }

  const submitText = handleSubmit(
    ({ text }) => trackLocalAction('message_send', () => void sendMessage(text)),
    () => captureAnalytics('message_form_validation_failed'),
  );
  function submit(event?: { preventDefault: () => void }) {
    event?.preventDefault();
    if (isSending) return;
    if (drafts.length && !messageDraft?.trim()) {
      trackLocalAction('message_send', () => void sendMessage(''));
      return;
    }
    void submitText();
  }
  return (
    <UIPanel className="flex h-full min-h-0 flex-col p-0">
      <div className="flex items-center gap-3 border-b border-white-5 px-5 py-4">
        <UIButton
          bg="transparent"
          size="icon"
          className="md:hidden"
          aria-label={t('app.back')}
          onClick={onBack}
        >
          <ArrowLeft size={18} />
        </UIButton>
        <UIAvatar
          imgSrc={
            current.imageUrl || (current.image ? `/app/rPsdQ-${current.image}.jpg` : undefined)
          }
          avatarSymbols={current.name.slice(0, 2)}
        />
        <div>
          <h2 className="text-section font-semibold">{current.name}</h2>
          {current.name === 'Kateryna Melnyk' && (
            <p className="text-detail text-secondary">{CHATMOCKS.status}</p>
          )}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end overflow-auto px-7 py-5">
        <div className="space-y-2.5 overflow-auto" role="log" aria-label={t('app.messages')}>
          {current.name === 'Kateryna Melnyk' && (
            <>
              <LinkToHousing />
              <p className="text-center text-detail text-muted">{t('app.todayLabel')}</p>
            </>
          )}
          {current.messages.map((m, i) => (
            <div
              key={i}
              className={`flex motion-safe:animate-rise-in ${m.outgoing ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-story px-3.5 py-2.5 text-body leading-[1.4] md:max-w-[420px] ${m.outgoing ? 'rounded-br-[6px] bg-blue' : 'rounded-bl-[6px] border border-white-10 bg-white-10'}`}
              >
                <MessageAttachments
                  attachments={m.attachments}
                  onOpenImage={(images, index) => setPreview({ images, index })}
                />
                {m.text && <p className="break-words whitespace-pre-wrap">{m.text}</p>}
                <span
                  className={`mt-1 block text-right text-caption ${m.outgoing ? 'text-white-80' : 'text-secondary'}`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}
          {current.messages.length === 0 && <UIEmpty />}
          {current.name === 'Kateryna Melnyk' && (
            <p className="text-detail text-muted">
              {CHATMOCKS.typing} {t('app.typing')}
            </p>
          )}
        </div>
      </div>
      <form
        className={cn(
          'mx-5 mb-5 border border-white-10 bg-white-5',
          isMultiline || drafts.length > 0 ? 'rounded-2xl' : 'rounded-full',
        )}
        onSubmit={submit}
      >
        <ChatDraftAttachments
          drafts={drafts}
          disabled={isSending}
          onOpenImage={(id) => {
            const images = drafts.filter(({ file }) => isChatImage(file));
            setPreview({
              images: images.map(({ file, url }) => ({ url, name: file.name })),
              index: images.findIndex((draft) => draft.id === id),
            });
          }}
          onRemove={removeAttachment}
        />
        <div className="flex items-end gap-2 p-2 pl-4">
          <input
            ref={fileInput}
            type="file"
            multiple
            accept={chatAttachmentAccept}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = '';
              addAttachments(files);
            }}
          />
          <UIButton
            type="button"
            size="icon"
            bg="transparent"
            aria-label={t('app.attachFile')}
            disabled={isSending || drafts.length >= MAX_CHAT_ATTACHMENTS}
            className="shrink-0 text-secondary enabled:hover:bg-transparent enabled:hover:text-white"
            onClick={() => fileInput.current?.click()}
          >
            <Paperclip size={20} aria-hidden="true" />
          </UIButton>
          <textarea
            autoComplete="off"
            aria-label={t('app.message')}
            {...register('text')}
            onInput={(event) => setIsMultiline(event.currentTarget.scrollHeight > 48)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            maxLength={4000}
            placeholder={t('app.writeMessage')}
            className="field-sizing-content max-h-32 min-h-9.5 min-w-0 flex-1 resize-none bg-transparent p-2 text-body leading-[1.4] outline-none placeholder:text-secondary"
          />
          <UIEmojiPicker className="shrink-0" />
          {hasContent && (
            <UIButton
              type="submit"
              size="icon"
              bg="transparent"
              leftIcon={Send}
              aria-label={t('app.send')}
              disabled={isSending}
              className="shrink-0 border-transparent enabled:hover:bg-transparent"
            >
              {''}
            </UIButton>
          )}
        </div>
      </form>
      <ChatImagePreview
        preview={preview}
        onIndexChange={(index) => setPreview((previous) => previous && { ...previous, index })}
        onClose={() => setPreview(null)}
      />
    </UIPanel>
  );
}

function LinkToHousing() {
  return (
    <Link
      to="/feed"
      className="mx-auto block max-w-xs rounded-2xl border border-white-10 bg-white-5 p-2 text-micro text-secondary"
    >
      {CHATMOCKS.context}
      <br />
      <strong className="text-label text-white">{CHATMOCKS.housing}</strong>
    </Link>
  );
}

function MessageAttachments({
  attachments,
  onOpenImage,
}: {
  attachments: MessageAttachment[] | undefined;
  onOpenImage: (images: { url: string; name: string }[], index: number) => void;
}) {
  const { t } = useTranslation();
  if (!attachments?.length) return null;
  const images = attachments.filter(({ contentType }) => isChatImage({ type: contentType }));
  const files = attachments.filter(({ contentType }) => !isChatImage({ type: contentType }));
  return (
    <>
      {images.length > 0 && (
        <ChatMessageImages images={images} onOpen={(index) => onOpenImage(images, index)} />
      )}
      {files.map((file) => (
        <a
          key={file.url}
          href={file.url}
          download={file.name}
          target="_blank"
          rel="noreferrer"
          aria-label={t('app.openFile')}
          data-ph-capture-attribute-label="Open chat file"
          className="mb-1 block w-64 max-w-full focus-visible:outline-2 focus-visible:outline-blue"
        >
          <ChatFileChip name={file.name} size={file.size} />
        </a>
      ))}
    </>
  );
}
