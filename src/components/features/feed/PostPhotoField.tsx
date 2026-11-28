import { useState } from 'react';
import { useController, type Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ImagePlus, Plus, Trash2, X } from 'lucide-react';
import { ChatImagePreview } from '@/components/features/chat';
import { postImagesSchema, type PostSchema } from '@/schemas';
import { UIButton } from '@/ui/components';
import { hasDuplicateImages, readImageFile, toast } from '@/utils';

export function PostPhotoField({
  control,
  readingImage,
  setReadingImage,
  disabled,
  phone = false,
}: {
  control: Control<PostSchema>;
  readingImage: boolean;
  setReadingImage: (reading: boolean) => void;
  disabled: boolean;
  /** The mobile app's photo row: an add tile and thumbnails that open full screen. */
  phone?: boolean;
}) {
  const { t } = useTranslation();
  const {
    field: { value: images, onChange },
  } = useController({ control, name: 'images' });
  const [previews, setPreviews] = useState<{ id: string; src: string }[]>([]);
  const [preview, setPreview] = useState<number | null>(null);

  async function addPhotos(files: File[]) {
    if (!files.length) return;
    const next = [...images, ...files];
    if (!postImagesSchema.safeParse(next).success) {
      toast.error(t('postComposer.photosError'));
      return;
    }
    setReadingImage(true);
    try {
      const added = await Promise.all(files.map(readImageFile));
      if (
        hasDuplicateImages(
          previews.map((preview) => preview.src),
          added,
        )
      ) {
        toast.error(t('postComposer.duplicatePhoto'));
        return;
      }
      const newPreviews = added.map((src) => ({ id: crypto.randomUUID(), src }));
      setPreviews((previous) => [...previous, ...newPreviews]);
      onChange(next);
    } catch {
      toast.error(t('postComposer.photosError'));
    } finally {
      setReadingImage(false);
    }
  }

  function removePhoto(index: number) {
    onChange(images.filter((_, item) => item !== index));
    setPreviews((previous) => previous.filter((_, item) => item !== index));
  }

  const fileInput = (
    <input
      id="post-photo"
      type="file"
      multiple
      accept="image/jpeg,image/png,image/webp"
      className="sr-only"
      disabled={disabled || images.length >= 10}
      aria-disabled={readingImage || disabled || images.length >= 10}
      onClick={(event) => {
        if (readingImage) event.preventDefault();
      }}
      onChange={(event) => {
        void addPhotos(Array.from(event.target.files ?? []));
        event.target.value = '';
      }}
    />
  );

  if (phone) {
    return (
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3 px-1">
          <span className="text-detail font-semibold text-white-80">
            {t('postComposer.photos')}
          </span>
          <span className="text-micro text-secondary">{images.length} / 10</span>
        </div>
        {/* bleeds to the screen edges and scrolls under the fades */}
        <div
          role="region"
          aria-label={t('postComposer.photos')}
          className="-mx-5 flex [scrollbar-width:none] gap-2 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)] px-5 sm:-mx-8 sm:px-8"
        >
          {images.length < 10 && (
            <label
              htmlFor="post-photo"
              aria-label={t('postComposer.addPhoto')}
              className="grid size-21 shrink-0 cursor-pointer place-items-center rounded-2xl border border-white/12 bg-white/3 has-disabled:opacity-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue"
            >
              {fileInput}
              <Plus size={20} aria-hidden="true" />
            </label>
          )}
          {previews.map((image, index) => (
            <div
              key={image.id}
              className="relative size-21 shrink-0 overflow-hidden rounded-2xl bg-surface-60"
            >
              <button
                type="button"
                aria-label={t('app.openImage')}
                data-ph-capture-attribute-label="Open post photo preview"
                onClick={() => setPreview(index)}
                className="size-full focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue"
              >
                <img
                  src={image.src}
                  alt={`${t('postComposer.photoPreview')} ${index + 1}`}
                  className="size-full object-cover"
                />
              </button>
              <button
                type="button"
                aria-label={`${t('postComposer.removePhoto')} ${index + 1}`}
                data-ph-capture-attribute-label="Remove post photo"
                disabled={disabled}
                onClick={() => {
                  if (!readingImage) removePhoto(index);
                }}
                className="absolute top-1.5 right-1.5 grid size-5.5 place-items-center rounded-full bg-ink-70 focus-visible:outline-2 focus-visible:outline-blue"
              >
                <X size={13} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
        <span className="px-1 text-micro text-secondary">{t('postComposer.photosHint')}</span>
        {readingImage && (
          <span role="status" className="sr-only">
            {t('postComposer.readingPhoto')}
          </span>
        )}
        <ChatImagePreview
          preview={
            preview === null
              ? null
              : {
                  images: previews.map(({ src }) => ({
                    url: src,
                    name: t('postComposer.photoPreview'),
                  })),
                  index: preview,
                }
          }
          onIndexChange={setPreview}
          onClose={() => setPreview(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-3">
      <p className="text-detail font-semibold text-secondary">{t('postComposer.photos')}</p>
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="post-photo"
          className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-white-10 bg-white-5 px-4 text-label font-semibold transition-colors hover:bg-white-10 has-disabled:cursor-not-allowed has-disabled:opacity-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue"
        >
          {fileInput}
          <ImagePlus className="size-4" aria-hidden="true" />
          <span>{t('postComposer.addPhoto')}</span>
        </label>
        <span className="text-detail text-secondary">{t('postComposer.photosHint')}</span>
      </div>
      {readingImage && (
        <span role="status" className="sr-only">
          {t('postComposer.readingPhoto')}
        </span>
      )}
      {previews.length > 0 && (
        <div
          role="region"
          aria-label={t('postComposer.photos')}
          tabIndex={0}
          className="flex h-38 max-w-full min-w-0 items-start gap-3 overflow-x-auto overflow-y-hidden rounded-feature [overflow-anchor:none] focus-visible:outline-2 focus-visible:outline-blue"
        >
          {previews.map((image, index) => (
            <div
              key={image.id}
              className="relative size-36 shrink-0 overflow-hidden rounded-feature"
            >
              <img
                src={image.src}
                alt={`${t('postComposer.photoPreview')} ${index + 1}`}
                className="size-full object-cover"
              />
              <UIButton
                size="icon"
                bg="secondary"
                aria-label={`${t('postComposer.removePhoto')} ${index + 1}`}
                className="absolute top-2 right-2 bg-surface aria-disabled:opacity-100"
                disabled={disabled}
                aria-disabled={readingImage || undefined}
                onClick={() => {
                  if (!readingImage) removePhoto(index);
                }}
              >
                <Trash2 size={18} className="text-danger" />
              </UIButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
