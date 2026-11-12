import { captureAnalytics } from '@/utils/analytics';
import { Check, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDeleteAvatar, useDeleteBanner } from '@/hooks/useProfiles';
import { useDeleteMyProfile } from '@/hooks/useMyProfile';
import { useProfileForm } from '@/hooks/useProfileForm';
import type { components } from '@/@types/schema';
import { UIButton, UITopbar, UIUnsavedChanges } from '@/ui/components';
import { ProfileIdentity } from './ProfileIdentity';
import { PersonalDetails } from './PersonalDetails';
import { StudyProgrammes } from './StudyProgrammes';

export function ProfileEditor({ profile }: { profile: components['schemas']['Profile'] }) {
  const { t } = useTranslation();
  const { form, saveProfile, isPending: isSaving } = useProfileForm(profile);
  const { mutateAsync: deleteAvatar, isPending: isDeleting } = useDeleteAvatar();
  const { mutateAsync: deleteBanner, isPending: isDeletingBanner } = useDeleteBanner();
  const { mutateAsync: deleteMyProfile, isPending: isDeletingProfile } = useDeleteMyProfile();
  const isPending = isSaving || isDeleting || isDeletingBanner || isDeletingProfile;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {
    handleSubmit,
    formState: { isDirty },
  } = form;
  return (
    <FormProvider {...form}>
      <UIUnsavedChanges dirty={isDirty} />
      <>
        <UITopbar title={t('app.yourProfile')}>
          <UIButton
            type="submit"
            form="profile-form"
            disabled={isPending || !isDirty}
            size="sm"
            leftIcon={Check}
            className="h-9 min-h-9 shrink-0 px-3 py-0 text-detail whitespace-nowrap"
          >
            {isDirty ? t('app.saveChanges') : t('app.saved')}
          </UIButton>
          <UIButton
            size="sm"
            bg="ghost"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isPending}
            aria-label={t('app.deleteAccount')}
            className="h-9 min-h-9 shrink-0 px-3 py-0 text-detail whitespace-nowrap text-danger"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('app.deleteAccount')}</span>
          </UIButton>
        </UITopbar>
        <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
          <fieldset disabled={isPending}>
            <ProfileIdentity
              universityId={profile.universityId}
              onRemoveBanner={async () => {
                if (form.getValues('bannerFile')) {
                  form.resetField('bannerFile');
                  return;
                }
                if (form.getValues('banner')) await deleteBanner();
                form.resetField('banner', { defaultValue: '' });
                form.resetField('bannerFile');
              }}
              onRemoveAvatar={async () => {
                if (form.getValues('avatarFile')) {
                  form.resetField('avatarFile');
                  return;
                }
                if (form.getValues('photo') !== '/app/avatar.png') await deleteAvatar();
                form.resetField('photo', { defaultValue: '/app/avatar.png' });
                form.resetField('avatarFile');
              }}
            />
          </fieldset>
          <div className="space-y-4.5">
            <form
              id="profile-form"
              onSubmit={handleSubmit(
                async (data) => {
                  try {
                    await saveProfile(data);
                    toast.success(t('app.saved'));
                  } catch {
                    toast.error(t('apiState.profileSaveError'));
                  }
                },
                () => captureAnalytics('profile_form_validation_failed'),
              )}
            >
              <fieldset disabled={isPending}>
                <PersonalDetails />
              </fieldset>
            </form>
            <StudyProgrammes universityId={profile.universityId} />
          </div>
        </div>
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowDeleteConfirm(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
          >
            <div
              className="relative w-full max-w-md rounded-xl bg-surface p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="delete-confirm-title" className="text-lg font-bold">
                {t('app.deleteAccountTitle')}
              </h2>
              <p className="mt-2 text-white-80">{t('app.deleteAccountDescription')}</p>
              <div className="mt-6 flex justify-end gap-3">
                <UIButton
                  bg="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeletingProfile}
                >
                  {t('app.cancel')}
                </UIButton>
                <UIButton
                  bg="danger"
                  onClick={async () => {
                    try {
                      await deleteMyProfile();
                      toast.success(t('app.accountDeleted'));
                    } catch {
                      toast.error(t('apiState.error'));
                    }
                  }}
                  disabled={isDeletingProfile}
                >
                  {t('app.deleteAccount')}
                </UIButton>
              </div>
            </div>
          </div>
        )}
      </>
    </FormProvider>
  );
}
