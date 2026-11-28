import { useTranslation } from 'react-i18next';

import type { ChatAttachment } from '@/@types';
import { CHAT_ALBUM_ROW_HEIGHTS, CHAT_ALBUM_ROWS } from '@/utils';

/** Phone-only: the mobile app's message album, 252px wide, rows of 1–3 photos by count. */
export function MessagePhotos({
  attachments,
  onOpen,
  onError,
}: {
  attachments: ChatAttachment[];
  onOpen: (index: number) => void;
  onError: () => void;
}) {
  const { t } = useTranslation();
  const rows = CHAT_ALBUM_ROWS[attachments.length] ?? [attachments.length];
  // where each row's photos start in `attachments`
  const starts = rows.map((_, index) => rows.slice(0, index).reduce((sum, size) => sum + size, 0));
  return (
    <div className="flex w-63 max-w-full flex-col gap-0.5 overflow-hidden rounded-[13px]">
      {rows.map((size, rowIndex) => {
        const start = starts[rowIndex] ?? 0;
        return (
          <div
            key={rowIndex}
            className="flex gap-0.5"
            style={{ height: CHAT_ALBUM_ROW_HEIGHTS[size] ?? 100 }}
          >
            {attachments.slice(start, start + size).map(({ mediaId, url }, offset) => (
              <button
                key={mediaId}
                type="button"
                aria-label={t('app.openImage')}
                data-ph-capture-attribute-label="Open chat image preview"
                onClick={() => onOpen(start + offset)}
                className="min-w-0 flex-1 bg-surface-60 focus-visible:outline-2 focus-visible:outline-blue"
              >
                <img
                  src={url}
                  alt={t('app.attachedImage')}
                  onError={onError}
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}
