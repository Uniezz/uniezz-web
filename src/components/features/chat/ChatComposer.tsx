import { captureAnalytics, getChatDraft, setChatDraft, toast } from '@/utils';
import { onlineManager } from '@tanstack/react-query';
import { Paperclip, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/ui/cn';
import { UIButton, UIEmojiPicker } from '@/ui/components';
import {
  MAX_CHAT_ATTACHMENTS,
  chatAttachmentAccept,
  chatAttachmentSchema,
  isChatImage,
  textFormSchema,
  type TextFormSchema,
} from '@/schemas';
import { useSendMessage, useUploadImage } from '@/hooks';
import { ChatDraftAttachments, type ChatDraftAttachment } from './ChatDraftAttachments';
import type { ChatPreviewState } from './ChatImagePreview';

export function ChatComposer({
  conversationId,
  onPreview,
}: {
  conversationId: string;
  onPreview: (preview: ChatPreviewState) => void;
}) {
  const { t } = useTranslation();
  const { register, control, handleSubmit, reset } = useForm<TextFormSchema>({
    resolver: zodResolver(textFormSchema),
    defaultValues: { text: getChatDraft(conversationId) },
    mode: 'onChange',
  });
  const [isMultiline, setIsMultiline] = useState(() => getChatDraft(conversationId).includes('\n'));
  const fileInput = useRef<HTMLInputElement>(null);
  const [drafts, setDrafts] = useState<ChatDraftAttachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const { mutateAsync: uploadImage } = useUploadImage('chat');
  const { mutate: send } = useSendMessage();
  const messageDraft = useWatch({ control, name: 'text' });
  const hasContent = Boolean(messageDraft?.trim()) || drafts.length > 0;

  // Typed text stays when the student opens another chat and comes back.
  useEffect(() => setChatDraft(conversationId, messageDraft ?? ''), [conversationId, messageDraft]);

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

  async function sendMessage(text: string) {
    // Offline, TanStack Query would pause the send without an error. The text and images stay here instead.
    if (!onlineManager.isOnline()) {
      captureAnalytics('message_send_failed', { stage: 'offline' });
      toast.error(t('chat.offline'));
      return;
    }
    setIsSending(true);
    try {
      const attachmentIds = await Promise.all(
        drafts.map(async ({ file }) => (await uploadImage(file)).mediaId),
      );
      const sent = drafts;
      // The message shows at once. When the send fails, the text and images come back to the composer.
      send(
        {
          conversationId,
          body: text || undefined,
          attachmentIds,
          clientId: crypto.randomUUID(),
        },
        {
          onSuccess: () => sent.forEach(({ url }) => URL.revokeObjectURL(url)),
          onError: () => {
            reset({ text });
            setDrafts(sent);
          },
        },
      );
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
    ({ text }) => void sendMessage(text),
    () => captureAnalytics('message_form_validation_failed'),
  );
  function submit(event?: { preventDefault: () => void }) {
    event?.preventDefault();
    if (isSending) return;
    if (drafts.length && !messageDraft?.trim()) {
      void sendMessage('');
      return;
    }
    void submitText();
  }

  return (
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
          onPreview({
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
  );
}
