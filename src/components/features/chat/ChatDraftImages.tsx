import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { UIButton } from '@/ui/components';

export type ChatDraftImage = { id: string; file: File; url: string };

export function ChatDraftImages({
  drafts,
  disabled,
  onOpen,
  onRemove,
}: {
  drafts: ChatDraftImage[];
  disabled: boolean;
  onOpen: (index: number) => void;
  onRemove: (id: string) => void;
}) {
  const { t } = useTranslation();
  if (!drafts.length) return null;
  return (
    <ul className="flex gap-3 overflow-x-auto px-4 pt-3" aria-label={t('app.attachedImages')}>
      {drafts.map(({ id, file, url }, index) => (
        <li key={id} className="relative size-20 shrink-0">
          <button
            type="button"
            aria-label={t('app.openImage')}
            data-ph-capture-attribute-label="Open chat image preview"
            className="size-full cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-blue"
            onClick={() => onOpen(index)}
          >
            <img src={url} alt={file.name} className="size-full rounded-xl object-cover" />
          </button>
          <UIButton
            type="button"
            size="icon"
            bg="secondary"
            aria-label={t('app.removeImage')}
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
