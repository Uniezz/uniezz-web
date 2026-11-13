import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import { Camera, ImagePlus, LogOut, Trash2, X } from 'lucide-react';

import { useSignOut, useUniversities } from '@/hooks';
import { useDeleteMyProfile } from '@/hooks';
import {
  UIButton,
  UIDialog,
  UILanguageSwitcher,
  UIPanel,
  UISwitch,
  UIUniversityLogo,
} from '@/ui/components';
import { type ProfileFormSchema } from '@/schemas';
import { readImageFile } from '@/utils';
import { cn } from '@/ui/cn';

export function ProfileIdentity({
  universityId,
  disabled,
  onRemoveBanner,
}: {
  universityId: string;
  disabled: boolean;
  onRemoveBanner: () => Promise<void>;
}) {
  const { data: universities } = useUniversities();
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();
  const { mutateAsync: deleteMyProfile, isPending: isDeletingProfile } = useDeleteMyProfile();
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
  const {
    field: { value: banner },
  } = useController({ control, name: 'banner' });
  const privacy = useWatch({ control, name: 'privacy' });
  const [preview, setPreview] = useState('');
  const [readingImage, setReadingImage] = useState(false);
  const [bannerPreview, setBannerPreview] = useState('');
  const [readingBanner, setReadingBanner] = useState(false);
  const [showRemoveBannerConfirm, setShowRemoveBannerConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
  async function removeBanner(): Promise<void> {
    try {
      await onRemoveBanner();
      setBannerPreview('');
      clearErrors('bannerFile');
      setShowRemoveBannerConfirm(false);
      toast.success(t('app.bannerRemoved'));
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
            className={cn(
              'inline-flex size-9 items-center justify-center rounded-full border border-white-10 bg-surface/80 text-secondary backdrop-blur-[12px] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue',
              disabled || readingBanner
                ? 'cursor-not-allowed opacity-40'
                : 'cursor-pointer hover:text-white',
            )}
          >
            <ImagePlus className="size-4.5" aria-hidden="true" />
            <input
              type="file"
              aria-label={t('app.changeBanner')}
              disabled={disabled || readingBanner}
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
              className="size-9 border border-white-10 bg-surface/80 p-0 text-danger backdrop-blur-[12px] enabled:hover:bg-surface/80 enabled:hover:text-danger-hover"
              disabled={disabled || readingBanner}
              onClick={() => setShowRemoveBannerConfirm(true)}
            >
              <X className="size-4.5" aria-hidden="true" />
            </UIButton>
          )}
        </div>
        <div className="relative">
          <div className="relative mx-auto mb-4.5 size-22">
            <img
              src={preview || photo}
              alt={`${defaultValues?.first} ${defaultValues?.last}`}
              className="size-full rounded-full object-cover"
            />
            <label
              data-ph-capture-attribute-label={t('app.changePhoto')}
              className={cn(
                'group absolute -right-1 -bottom-1 inline-flex size-10 items-center justify-center rounded-full has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue',
                disabled || readingImage ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
              )}
            >
              <span
                className={cn(
                  'inline-flex size-7 items-center justify-center rounded-full border border-white-10 bg-surface/80 text-secondary backdrop-blur-[12px] transition-colors',
                  !disabled && !readingImage && 'group-hover:text-white',
                )}
              >
                <Camera className="size-3.5" aria-hidden="true" />
              </span>
              <input
                type="file"
                aria-label={t('app.changePhoto')}
                disabled={disabled || readingImage}
                className="sr-only"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  void changePhoto(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </label>
          </div>
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
          disabled={isSigningOut || isDeletingProfile}
          onClick={() => signOut(undefined, { onError: () => toast.error(t('apiState.error')) })}
        >
          <LogOut size={16} aria-hidden="true" />
          {t('app.signOut')}
        </UIButton>
        <UIButton
          bg="transparent"
          size="pill"
          className="mt-2 w-full text-danger"
          disabled={isSigningOut || isDeletingProfile}
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash2 size={16} aria-hidden="true" />
          {t('app.deleteAccount')}
        </UIButton>
      </UIPanel>
      <UIDialog
        open={showRemoveBannerConfirm}
        onOpenChange={setShowRemoveBannerConfirm}
        dismissible={!disabled}
        title={t('students.removeBanner')}
        description={t('app.removeBannerDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton
            bg="secondary"
            disabled={disabled}
            onClick={() => setShowRemoveBannerConfirm(false)}
          >
            {t('app.cancel')}
          </UIButton>
          <UIButton bg="danger" disabled={disabled} onClick={() => void removeBanner()}>
            {t('students.removeBanner')}
          </UIButton>
        </div>
      </UIDialog>
      <UIDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        dismissible={!isDeletingProfile}
        title={t('app.deleteAccountTitle')}
        description={t('app.deleteAccountDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton
            bg="secondary"
            onClick={() => setShowDeleteConfirm(false)}
            disabled={isDeletingProfile}
          >
            {t('app.cancel')}
          </UIButton>
          <UIButton
            bg="danger"
            disabled={isDeletingProfile}
            onClick={async () => {
              try {
                await deleteMyProfile();
                toast.success(t('app.accountDeleted'));
              } catch {
                toast.error(t('apiState.error'));
              }
            }}
          >
            {t('app.deleteAccount')}
          </UIButton>
        </div>
      </UIDialog>
    </div>
  );
}
