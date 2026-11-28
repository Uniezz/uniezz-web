import { ArrowUp, Plus } from 'lucide-react';
import { useRef, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { UIButton } from '@/ui/components';
import { chatAttachmentAccept, chatAttachmentSchema } from '@/schemas';
import { CHAT_MESSAGE_MAX_LENGTH, MAX_CHAT_PHOTOS } from '@/utils';
import { DraftPhotos, type DraftPhoto } from './DraftPhotos';

/**
 * Phone-only: the mobile app's MessageComposer — a glass attach button, a growing glass field and a
 * white send circle. Return adds a line; only Send sends.
 */
export function MessageComposer({
  text,
  onTextChange,
  photos,
  onPhotosChange,
  isAttachHidden,
  isSendDisabled,
  onSend,
  onOpenPhoto,
}: {
  text: string;
  onTextChange: (text: string) => void;
  photos: DraftPhoto[];
  onPhotosChange: (photos: DraftPhoto[]) => void;
  /** a request's first message is text only */
  isAttachHidden: boolean;
  isSendDisabled: boolean;
  onSend: () => void;
  onOpenPhoto: (index: number) => void;
}) {
  const { t } = useTranslation();
  const fileInput = useRef<HTMLInputElement>(null);
  const isAttachDisabled = photos.length >= MAX_CHAT_PHOTOS;

  const handlePick = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []).filter(
      (file) =>
        chatAttachmentSchema.safeParse(file).success &&
        // a photo picked twice is skipped
        !photos.some(({ file: other }) => other.name === file.name && other.size === file.size),
    );
    event.target.value = '';
    onPhotosChange(
      [
        ...photos,
        ...picked.map((file) => ({
          id: crypto.randomUUID(),
          file,
          url: URL.createObjectURL(file),
        })),
      ].slice(0, MAX_CHAT_PHOTOS),
    );
  };
  const handleRemove = (id: string) => {
    const removed = photos.find((photo) => photo.id === id);
    if (removed) URL.revokeObjectURL(removed.url);
    onPhotosChange(photos.filter((photo) => photo.id !== id));
  };
  const handleAttach = () => fileInput.current?.click();

  return (
    <div>
      {photos.length > 0 && (
        <DraftPhotos
          photos={photos}
          disabled={false}
          onOpen={onOpenPhoto}
          onRemove={handleRemove}
        />
      )}
      <div className="flex items-end gap-2">
        {!isAttachHidden && (
          <>
            <input
              ref={fileInput}
              type="file"
              multiple
              accept={chatAttachmentAccept}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={handlePick}
            />
            <UIButton
              size="square"
              bg="glass"
              aria-label={t('app.attachFile')}
              disabled={isAttachDisabled}
              onClick={handleAttach}
              className="size-11 text-white-80"
            >
              <Plus size={20} aria-hidden="true" />
            </UIButton>
          </>
        )}
        <div className="flex max-h-30 min-h-11 min-w-0 flex-1 items-center rounded-[22px] px-4 glass">
          <textarea
            autoComplete="off"
            aria-label={t('app.message')}
            placeholder={t('app.message')}
            enterKeyHint="enter"
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            rows={1}
            maxLength={CHAT_MESSAGE_MAX_LENGTH}
            className="field-sizing-content max-h-29.5 min-w-0 flex-1 resize-none bg-transparent py-2.5 text-base leading-[22px] text-white outline-none placeholder:text-white-60"
          />
        </div>
        <button
          type="button"
          aria-label={t('app.send')}
          data-ph-capture-attribute-label="Send message"
          disabled={isSendDisabled}
          onClick={onSend}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink focus-visible:outline-2 focus-visible:outline-blue disabled:opacity-50"
        >
          <ArrowUp size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
