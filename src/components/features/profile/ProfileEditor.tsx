import { captureAnalytics } from '@/utils';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDeleteBanner } from '@/hooks';
import { useProfileForm } from '@/hooks';
import type { components } from '@/@types/schema';
import { UIButton, UIPanel, UITopbar, UIUnsavedChanges } from '@/ui/components';
import { ProfileIdentity } from './ProfileIdentity';
import { PersonalDetails } from './PersonalDetails';
import { StudyProgrammes } from './StudyProgrammes';
import { ProfilePosts } from './ProfilePosts';

export function ProfileEditor({
  profile,
  showPosts = true,
}: {
  profile: components['schemas']['Profile'];
  showPosts?: boolean;
}) {
  const { t } = useTranslation();
  const { form, saveProfile, isPending: isSaving } = useProfileForm(profile);
  const { mutateAsync: deleteBanner, isPending: isDeletingBanner } = useDeleteBanner();
  const isPending = isSaving || isDeletingBanner;
  const {
    handleSubmit,
    formState: { isDirty },
  } = form;
  return (
    <FormProvider {...form}>
      <UIUnsavedChanges dirty={isDirty} />
      <>
        <UITopbar title={t('app.yourProfile')}>
          {isDirty && (
            <UIButton
              type="submit"
              form="profile-form"
              disabled={isPending}
              size="sm"
              leftIcon={Check}
              className="h-9 min-h-9 shrink-0 px-3 py-0 text-detail whitespace-nowrap"
            >
              {t('app.saveChanges')}
            </UIButton>
          )}
        </UITopbar>
        <div className="grid min-w-0 gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
          <fieldset disabled={isPending}>
            <ProfileIdentity
              universityId={profile.universityId}
              disabled={isPending}
              onRemoveBanner={async () => {
                if (form.getValues('banner')) await deleteBanner();
                form.resetField('banner', { defaultValue: '' });
                form.resetField('bannerFile');
              }}
            />
          </fieldset>
          <UIPanel
            surface="tint"
            className="grid min-w-0 items-start gap-6 rounded-profile lg:grid-cols-2"
          >
            <form
              id="profile-form"
              className="min-w-0"
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
            <div className="min-w-0">
              <StudyProgrammes universityId={profile.universityId} />
            </div>
          </UIPanel>
          {showPosts && (
            <div className="min-w-0 xl:col-span-2">
              <ProfilePosts authorId={profile.id} collections />
            </div>
          )}
        </div>
      </>
    </FormProvider>
  );
}
