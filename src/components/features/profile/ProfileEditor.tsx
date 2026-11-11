import { captureAnalytics } from '@/utils/analytics';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDeleteAvatar, useDeleteBanner } from '@/hooks/useProfiles';
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
  const isPending = isSaving || isDeleting || isDeletingBanner;
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
            <StudyProgrammes
              universityId={profile.universityId}
              initialProgrammes={profile.programmes ?? []}
            />
          </div>
        </div>
      </>
    </FormProvider>
  );
}
