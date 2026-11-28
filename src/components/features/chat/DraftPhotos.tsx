import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type DraftPhoto = { id: string; file: File; url: string };

/** Phone-only: the mobile app's DraftPhotos, a fading row of 72px thumbs above the composer. */
export function DraftPhotos({
  photos,
  disabled,
  onOpen,
  onRemove,
}: {
  photos: DraftPhoto[];
  disabled: boolean;
  onOpen: (index: number) => void;
  onRemove: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <ul
      aria-label={t('app.attachmentsToSend')}
      className="-mx-4 mb-2 scrollbar-hidden flex gap-2 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] px-4 py-2.5"
    >
      {photos.map(({ id, file, url }, index) => (
        <li key={id} className="relative size-18 shrink-0 overflow-hidden rounded-xl bg-surface-60">
          <button
            type="button"
            aria-label={t('app.openImage')}
            data-ph-capture-attribute-label="Open chat image preview"
            className="size-full focus-visible:outline-2 focus-visible:outline-blue"
            onClick={() => onOpen(index)}
          >
            <img src={url} alt={file.name} className="size-full object-cover" />
          </button>
          <button
            type="button"
            aria-label={t('app.removeAttachment')}
            data-ph-capture-attribute-label="Remove chat image"
            disabled={disabled}
            onClick={() => onRemove(id)}
            className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-ink-70 focus-visible:outline-2 focus-visible:outline-blue"
          >
            <X size={12} aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
