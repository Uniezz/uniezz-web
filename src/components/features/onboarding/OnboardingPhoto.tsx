import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import { Camera } from 'lucide-react';
import { type ProfileFormSchema } from '@/schemas';
import { readImageFile } from '@/utils';

export function OnboardingPhoto() {
  const { t } = useTranslation();
  const {
    control,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<ProfileFormSchema>();
  const photo = useWatch({ control, name: 'photo' });
  const {
    field: { onChange: setAvatarFile },
  } = useController({ control, name: 'avatarFile' });
  const [preview, setPreview] = useState('');
  const [reading, setReading] = useState(false);

  async function changePhoto(file?: File): Promise<void> {
    if (!file) return;
    setAvatarFile(file);
    if (!(await trigger('avatarFile'))) return;
    setReading(true);
    try {
      setPreview(await readImageFile(file));
      clearErrors('avatarFile');
    } catch {
      setAvatarFile(undefined);
      setError('avatarFile', { type: 'validate', message: t('app.photoError') });
    } finally {
      setReading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 py-6 text-center">
      <label
        data-ph-capture-attribute-label={t('app.changePhoto')}
        className="group relative size-40 cursor-pointer rounded-full has-[:disabled]:cursor-not-allowed has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-blue"
      >
        <span
          aria-hidden
          className="absolute -inset-6 rounded-full bg-blue/25 blur-2xl transition-opacity group-hover:opacity-100 sm:opacity-70"
        />
        <img
          src={preview || photo}
          alt=""
          className="relative size-full rounded-full object-cover"
        />
        <span className="absolute right-1 bottom-1 inline-flex size-11 items-center justify-center rounded-full bg-white text-ink shadow-lg transition-transform group-hover:scale-105">
          <Camera size={18} aria-hidden />
        </span>
        <input
          type="file"
          aria-label={t('app.changePhoto')}
          disabled={reading}
          className="sr-only"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            void changePhoto(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </label>
      <p className="max-w-60 text-sm leading-6 text-secondary">{t('onboarding.photo.hint')}</p>
      {errors.avatarFile && (
        <p role="alert" className="text-detail text-warning">
          {t('app.photoError')}
        </p>
      )}
    </div>
  );
}
