import { useTranslation } from 'react-i18next';
import type { FieldError, UseFormReturn } from 'react-hook-form';
import { ImagePlus, Trash2 } from 'lucide-react';

import type { PostSchema } from '@/schemas';
import { UIButton } from '@/ui/components';
import { readImageFile } from '@/utils/image';

export function PostPhotoField({
  image,
  setImage,
  readingImage,
  setReadingImage,
  imageError,
  form,
  disabled,
}: {
  image: string;
  setImage: (image: string) => void;
  readingImage: boolean;
  setReadingImage: (reading: boolean) => void;
  imageError?: FieldError;
  form: Pick<UseFormReturn<PostSchema>, 'setValue' | 'clearErrors' | 'setError' | 'trigger'>;
  disabled: boolean;
}) {
  const { t } = useTranslation();

  async function changePhoto(file?: File) {
    if (!file) return;
    setImage('');
    setReadingImage(true);
    form.setValue('image', file, { shouldDirty: true });
    try {
      if (!(await form.trigger('image'))) return;
      setImage(await readImageFile(file));
    } catch {
      form.setValue('image', undefined, { shouldDirty: true });
      form.setError('image', { type: 'validate', message: t('app.photoError') });
    } finally {
      setReadingImage(false);
    }
  }

  function removePhoto() {
    setImage('');
    form.setValue('image', undefined, { shouldDirty: true });
    form.clearErrors('image');
  }

  return (
    <div className="space-y-3">
      <p className="text-detail font-semibold text-secondary">{t('postComposer.photo')}</p>
      <div className="relative h-36 overflow-hidden rounded-feature focus-within:outline-2 focus-within:outline-blue">
        <input
          id="post-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label={t('postComposer.addPhoto')}
          className="sr-only"
          disabled={readingImage || disabled}
          onChange={(event) => {
            void changePhoto(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
        {image ? (
          <>
            <img
              src={image}
              alt={t('postComposer.photoPreview')}
              className="size-full object-cover"
            />
            <UIButton
              size="icon"
              bg="secondary"
              aria-label={t('postComposer.removePhoto')}
              className="absolute top-3 right-3 bg-surface"
              onClick={removePhoto}
            >
              <Trash2 size={18} className="text-danger" />
            </UIButton>
          </>
        ) : (
          <label
            htmlFor="post-photo"
            className="flex h-full cursor-pointer flex-col items-center justify-center gap-2 rounded-feature border border-dashed border-white-20 bg-white-5 p-5 text-center transition-colors hover:bg-white-10"
          >
            <ImagePlus className="mb-1 size-6 text-secondary" aria-hidden="true" />
            <span className="text-label font-semibold">
              {readingImage ? t('postComposer.readingPhoto') : t('postComposer.addPhoto')}
            </span>
            <span className="text-detail text-secondary">{t('postComposer.photoHint')}</span>
          </label>
        )}
      </div>
      {imageError && (
        <p role="alert" className="text-detail text-danger">
          {t('apiState.imageError')}
        </p>
      )}
    </div>
  );
}
