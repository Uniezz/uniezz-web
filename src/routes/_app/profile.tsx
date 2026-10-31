import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';

import { myProfileQueryOptions } from '@/hooks/useMyProfile';
import { useProfileForm } from '@/hooks/useProfileForm';
import type { components } from '@/@types/schema';
import { UIButton, UIQueryError, UITopbar, UIUnsavedChanges } from '@/ui/components';
import { ProfileIdentity, PersonalDetails, StudyProgrammes } from '@/components/features/profile';
import { ProfileSkeleton } from '@/components/features/profile/ProfileSkeleton';

export const Route = createFileRoute('/_app/profile')({
  loader: ({ context }) => context.queryClient.ensureQueryData(myProfileQueryOptions()),
  pendingComponent: ProfileSkeleton,
  errorComponent: ProfileError,
  component: ProfilePage,
});

function ProfileError() {
  const router = useRouter();
  return <UIQueryError retry={() => void router.invalidate()} />;
}

function ProfilePage() {
  const profile = Route.useLoaderData();
  return <ProfileEditor key={profile.id} profile={profile} />;
}

function ProfileEditor({ profile }: { profile: components['schemas']['Profile'] }) {
  const { t } = useTranslation();
  const { form, saveProfile, isSuccess, isPending } = useProfileForm(profile);
  const {
    handleSubmit,
    formState: { isDirty },
  } = form;
  const saved = isSuccess && !isDirty;
  return (
    <FormProvider {...form}>
      <UIUnsavedChanges dirty={isDirty} />
      <>
        <UITopbar title={t('app.yourProfile')}>
          <UIButton
            type="submit"
            form="profile-form"
            disabled={isPending}
            size="sm"
            leftIcon={Check}
            className="h-9 min-h-9 shrink-0 px-3 py-0 text-detail whitespace-nowrap"
          >
            {saved ? t('app.saved') : t('app.saveChanges')}
          </UIButton>
        </UITopbar>
        <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
          <fieldset disabled={isPending}>
            <ProfileIdentity universityId={profile.universityId} />
          </fieldset>
          <div className="space-y-4.5">
            <form
              id="profile-form"
              onSubmit={handleSubmit(async (data) => {
                try {
                  await saveProfile(data);
                  toast.success(t('app.saved'));
                } catch {
                  toast.error(t('apiState.profileSaveError'));
                }
              })}
            >
              <fieldset disabled={isPending}>
                <PersonalDetails />
              </fieldset>
            </form>
            <StudyProgrammes universityId={profile.universityId} />
          </div>
        </div>
      </>
    </FormProvider>
  );
}
