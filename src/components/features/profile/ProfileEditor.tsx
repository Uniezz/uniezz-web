import { Link } from '@tanstack/react-router';
import {
  apiErrorKey,
  captureAnalytics,
  formatCompactNumber,
  isStaff,
  profileUrl,
  toast,
} from '@/utils';
import { Check, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from 'react-hook-form';
import { useDeleteBanner } from '@/hooks';
import { useProfileForm } from '@/hooks';
import type { components } from '@/@types/schema';
import { UIButton, UICoin, UICopyLink, UIPanel, UITopbar, UIUnsavedChanges } from '@/ui/components';
import { ProfileIdentity } from './ProfileIdentity';
import { PersonalDetails } from './PersonalDetails';
import { StudyProgrammes } from './StudyProgrammes';
import { ProfilePosts } from './ProfilePosts';
import { ProfilePhotos } from './ProfilePhotos';

export function ProfileEditor({
  profile,
  showPosts = true,
}: {
  profile: components['schemas']['Profile'];
  showPosts?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const { form, saveProfile, isDirty, isPending: isSaving } = useProfileForm(profile);
  const { mutateAsync: deleteBanner, isPending: isDeletingBanner } = useDeleteBanner();
  const isPending = isSaving || isDeletingBanner;
  const { handleSubmit } = form;
  return (
    <FormProvider {...form}>
      <>
        <UIUnsavedChanges dirty={isDirty} />
        <UITopbar title={t('app.yourProfile')}>
          {/* on a phone the bottom tabs leave these out, as in the mobile app: the coins open rewards */}
          <Link
            to="/rewards"
            data-ph-capture-attribute-label={t('rewards.title')}
            aria-label={`${t('rewards.balance')}: ${profile.coins}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white-10 bg-white-5 px-3 text-detail font-semibold lg:hidden"
          >
            <UICoin />
            {formatCompactNumber(profile.coins, i18n.resolvedLanguage)}
          </Link>
          {isStaff(profile) && (
            <Link
              to="/moderation"
              data-ph-capture-attribute-label={t('moderation.title')}
              aria-label={t('moderation.title')}
              className="inline-flex size-9 items-center justify-center rounded-full border border-white-10 bg-white-5 lg:hidden"
            >
              <ShieldCheck className="size-4" aria-hidden />
            </Link>
          )}
          <UICopyLink
            url={profileUrl(profile.id)}
            analyticsLabel="Copy my profile link"
            className="h-9 min-h-9 shrink-0 rounded-full border border-white-10 bg-white-5 px-3 py-0 text-detail whitespace-nowrap text-white enabled:hover:bg-white-20"
          />
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
        {/* on a phone, the app's order: hero, photos, details and programmes, settings, then posts */}
        <div className="grid min-w-0 gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
          <ProfileIdentity
            universityId={profile.universityId}
            disabled={isPending}
            onRemoveBanner={async () => {
              if (form.getValues('banner')) await deleteBanner();
              form.resetField('banner', { defaultValue: '' });
              form.resetField('bannerFile');
            }}
          />
          <UIPanel
            surface="tint"
            className="grid min-w-0 items-start gap-6 rounded-profile max-lg:order-3 lg:grid-cols-2"
          >
            <form
              id="profile-form"
              className="min-w-0"
              onSubmit={handleSubmit(
                async (data) => {
                  try {
                    await saveProfile(data);
                    toast.success(t('app.saved'));
                  } catch (error) {
                    toast.error(t(apiErrorKey(error, 'apiState.profileSaveError')));
                  }
                },
                () => captureAnalytics('profile_form_validation_failed'),
              )}
            >
              <PersonalDetails />
            </form>
            <div className="min-w-0">
              <StudyProgrammes universityId={profile.universityId} />
            </div>
          </UIPanel>
          <div className="min-w-0 max-lg:order-2 xl:col-span-2">
            <ProfilePhotos />
          </div>
          {showPosts && (
            <div className="min-w-0 max-lg:order-5 xl:col-span-2">
              <ProfilePosts authorId={profile.id} collections />
            </div>
          )}
        </div>
      </>
    </FormProvider>
  );
}
