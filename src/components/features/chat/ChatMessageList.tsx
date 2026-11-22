import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import type { Conversation, MessageAttachment } from '@/@types';
import { UIEmpty } from '@/ui/components';
import { isChatImage } from '@/schemas';
// TODO(api): Replace mock chat context and typing content with API-backed conversation data.
import { CHATMOCKS } from '@/utils';
import { ChatFileChip } from './ChatFileChip';
import { ChatMessageImages } from './ChatMessageImages';
import type { ChatPreviewState } from './ChatImagePreview';

export function ChatMessageList({
  current,
  onPreview,
}: {
  current: Conversation;
  onPreview: (preview: ChatPreviewState) => void;
}) {
  const { t } = useTranslation();
  return (
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
                onOpenImage={(images, index) => onPreview({ images, index })}
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
