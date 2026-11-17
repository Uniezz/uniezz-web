import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { isChatImage } from '@/schemas';
import { UIButton } from '@/ui/components';
import { ChatFileChip } from './ChatFileChip';

export type ChatDraftAttachment = { id: string; file: File; url: string };

export function ChatDraftAttachments({
  drafts,
  disabled,
  onOpenImage,
  onRemove,
}: {
  drafts: ChatDraftAttachment[];
  disabled: boolean;
  onOpenImage: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const { t } = useTranslation();
  if (!drafts.length) return null;
  return (
    <ul className="flex gap-3 overflow-x-auto px-4 pt-3" aria-label={t('app.attachmentsToSend')}>
      {drafts.map(({ id, file, url }) => (
        <li
          key={id}
          className={isChatImage(file) ? 'relative size-20 shrink-0' : 'relative w-52 shrink-0'}
        >
          {isChatImage(file) ? (
            <button
              type="button"
              aria-label={t('app.openImage')}
              data-ph-capture-attribute-label="Open chat image preview"
              className="size-full cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-blue"
              onClick={() => onOpenImage(id)}
            >
              <img src={url} alt={file.name} className="size-full rounded-xl object-cover" />
            </button>
          ) : (
            <ChatFileChip name={file.name} size={file.size} className="h-full pr-8" />
          )}
          <UIButton
            type="button"
            size="icon"
            bg="secondary"
            aria-label={t('app.removeAttachment')}
            disabled={disabled}
            className="absolute top-1 right-1 size-5 min-h-0 bg-surface p-0"
            onClick={() => onRemove(id)}
          >
            <X size={12} aria-hidden="true" />
          </UIButton>
        </li>
      ))}
    </ul>
  );
}
