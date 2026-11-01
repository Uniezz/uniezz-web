import { useState } from 'react';
import { useController, type Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { ImagePlus, Trash2 } from 'lucide-react';
import { postImagesSchema, type PostSchema } from '@/schemas';
import { UIButton } from '@/ui/components';
import { hasDuplicateImages, readImageFile } from '@/utils/image';

export function PostPhotoField({
  control,
  readingImage,
  setReadingImage,
  disabled,
}: {
  control: Control<PostSchema>;
  readingImage: boolean;
  setReadingImage: (reading: boolean) => void;
  disabled: boolean;
}) {
  const { t } = useTranslation();
  const {
    field: { value: images, onChange },
  } = useController({ control, name: 'images' });
  const [previews, setPreviews] = useState<{ id: string; src: string }[]>([]);

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

  return (
    <div className="min-w-0 space-y-3">
      <p className="text-detail font-semibold text-secondary">{t('postComposer.photos')}</p>
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="post-photo"
          className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-white-10 bg-white-5 px-4 text-label font-semibold transition-colors hover:bg-white-10 has-disabled:cursor-not-allowed has-disabled:opacity-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue"
        >
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
