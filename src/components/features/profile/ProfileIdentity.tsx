import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import { ImagePlus, X } from 'lucide-react';

import { useSignOut, useUniversities } from '@/hooks';
import { UIButton, UILanguageSwitcher, UIPanel, UISwitch, UIUniversityLogo } from '@/ui/components';
import { type ProfileFormSchema } from '@/schemas';
import { readImageFile } from '@/utils/image';

export function ProfileIdentity({
  universityId,
  onRemoveAvatar,
  onRemoveBanner,
}: {
  universityId: string;
  onRemoveAvatar: () => Promise<void>;
  onRemoveBanner: () => Promise<void>;
}) {
  const { data: universities } = useUniversities();
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();
  const { t } = useTranslation();
  const {
    control,
    setValue,
    trigger,
    setError,
    clearErrors,
    formState: { defaultValues, errors },
  } = useFormContext<ProfileFormSchema>();
  const {
    field: { value: photo },
  } = useController({ control, name: 'photo' });
  const {
    field: { onChange: setAvatarFile },
  } = useController({ control, name: 'avatarFile' });
  const {
    field: { onChange: setBannerFile },
  } = useController({ control, name: 'bannerFile' });
  const privacy = useWatch({ control, name: 'privacy' });
  const banner = useWatch({ control, name: 'banner' });
  const [preview, setPreview] = useState('');
  const [readingImage, setReadingImage] = useState(false);
  const [bannerPreview, setBannerPreview] = useState('');
  const [readingBanner, setReadingBanner] = useState(false);
  async function changePhoto(file?: File): Promise<void> {
    if (!file) return;
    setAvatarFile(file);
    if (!(await trigger('avatarFile'))) return;
    setReadingImage(true);
    try {
      setPreview(await readImageFile(file));
      clearErrors('avatarFile');
    } catch {
      setAvatarFile(undefined);
      setError('avatarFile', { type: 'validate', message: t('app.photoError') });
    } finally {
      setReadingImage(false);
    }
  }
  async function changeBanner(file?: File): Promise<void> {
    if (!file) return;
    setBannerFile(file);
    if (!(await trigger('bannerFile'))) return;
    setReadingBanner(true);
    try {
      setBannerPreview(await readImageFile(file));
      clearErrors('bannerFile');
    } catch {
      setBannerFile(undefined);
      setError('bannerFile', { type: 'validate', message: t('app.bannerError') });
    } finally {
      setReadingBanner(false);
    }
  }
  const currentBanner = bannerPreview || banner;
  async function removePhoto(): Promise<void> {
    try {
      await onRemoveAvatar();
      setPreview('');
      clearErrors('avatarFile');
    } catch {
      toast.error(t('apiState.error'));
    }
  }
  return (
    <div className="space-y-4">
      <UIPanel surface="tint" className="relative overflow-hidden rounded-profile text-center">
        {currentBanner && (
          <>
            <img src={currentBanner} alt="" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-ink/60" aria-hidden="true" />
          </>
        )}
        <div className="absolute top-3 right-3 z-10 flex gap-1.5">
          <label
            data-ph-capture-attribute-label={t('app.changeBanner')}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-white-10 bg-surface/80 text-secondary backdrop-blur-[12px] transition-colors focus-within:outline-2 focus-within:outline-blue hover:text-white"
          >
            <ImagePlus className="size-4.5" aria-hidden="true" />
            <input
              type="file"
              aria-label={t('app.changeBanner')}
              disabled={readingBanner}
              className="sr-only"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                void changeBanner(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </label>
          {currentBanner && (
            <UIButton
              bg="transparent"
              size="pill"
              aria-label={t('students.removeBanner')}
              className="size-9 border border-white-10 bg-surface/80 p-0 text-secondary backdrop-blur-[12px] enabled:hover:text-white"
              disabled={readingBanner}
              onClick={onRemoveBanner}
            >
              <X className="size-4.5" aria-hidden="true" />
            </UIButton>
          )}
        </div>
        <div className="relative">
          <img
            src={preview || photo}
            alt={`${defaultValues?.first} ${defaultValues?.last}`}
            className="mx-auto mb-4.5 size-22 rounded-full object-cover"
          />
          <h2 className="text-[21px] leading-[1.2] font-bold">
            {defaultValues?.first} {defaultValues?.last}
          </h2>
          <p className="mt-1.25 text-detail font-medium text-balance text-secondary">
            <UIUniversityLogo
              universityId={universityId}
              size="xs"
              className="mr-1.5 align-middle"
            />
            {universities?.find((item) => item.id === universityId)?.name ??
              universityId.toUpperCase()}
          </p>
          <label className="mt-4.5 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border border-white-10 bg-white-5 px-5 text-detail font-semibold focus-within:outline-2 focus-within:outline-blue">
            {t('app.changePhoto')}
            <input
              type="file"
              disabled={readingImage}
              className="sr-only"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                void changePhoto(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </label>
          {(preview || photo !== '/app/avatar.png') && (
            <UIButton
              bg="transparent"
              size="pill"
              className="mt-2 text-danger"
              disabled={readingImage}
              onClick={removePhoto}
            >
              {t('students.removePhoto')}
            </UIButton>
          )}
          {errors.avatarFile && (
            <p role="alert" className="mt-3 text-detail text-warning">
              {t('app.photoError')}
            </p>
          )}
          {errors.bannerFile && (
            <p role="alert" className="mt-3 text-detail text-warning">
              {t('app.bannerError')}
            </p>
          )}
        </div>
      </UIPanel>
      <UIPanel surface="tint" className="rounded-profile p-4.5">
        <h2 className="mb-3.5 text-base font-bold">{t('app.profileVisibility')}</h2>
        <div className="space-y-3">
          <UISwitch
            label={t('apiState.showEmail')}
            checked={privacy.showEmail}
            onChange={(value) => setValue('privacy.showEmail', value, { shouldDirty: true })}
          />
          <UISwitch
            label={t('apiState.showFaculty')}
            checked={privacy.showFaculty}
            onChange={(value) => setValue('privacy.showFaculty', value, { shouldDirty: true })}
          />
          <UISwitch
            label={t('apiState.showYear')}
            checked={privacy.showYear}
            onChange={(value) => setValue('privacy.showYear', value, { shouldDirty: true })}
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white-10 pt-4">
          <span className="text-detail font-semibold">{t('topbar.changeLanguage')}</span>
          <UILanguageSwitcher />
        </div>
        <UIButton
          bg="transparent"
          size="pill"
          className="mt-4 w-full text-danger"
          disabled={isSigningOut}
          onClick={() => signOut(undefined, { onError: () => toast.error(t('apiState.error')) })}
        >
          {t('app.signOut')}
        </UIButton>
      </UIPanel>
    </div>
  );
}
