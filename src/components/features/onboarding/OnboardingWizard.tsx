import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';
import type { components } from '@/@types/schema';
import { useDeleteBanner, useProfileForm } from '@/hooks';
import { UIButton, UIPanel, UITopbar, UIUnsavedChanges } from '@/ui/components';
import { captureAnalytics, toast } from '@/utils';
import { PersonalDetails, ProfileIdentity, StudyProgrammes } from '../profile';

const STEP_COUNT = 3;

export function OnboardingWizard({ profile }: { profile: components['schemas']['Profile'] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { form, saveProfile, isPending: isSaving } = useProfileForm(profile);
  const { mutateAsync: deleteBanner, isPending: isDeletingBanner } = useDeleteBanner();
  const isPending = isSaving || isDeletingBanner;
  const {
    handleSubmit,
    formState: { isDirty },
  } = form;
  const isLast = step === STEP_COUNT - 1;

  // Photo and details share one form, so they are saved together when leaving the details step.
  const saveDetails = handleSubmit(
    async (data) => {
      try {
        if (isDirty) await saveProfile(data);
        setStep(2);
      } catch {
        toast.error(t('apiState.profileSaveError'));
      }
    },
    () => captureAnalytics('profile_form_validation_failed'),
  );

  function goToFeed() {
    void navigate({ to: '/feed', replace: true });
  }

  return (
    <FormProvider {...form}>
      <UIUnsavedChanges dirty={isDirty} />
      <UITopbar
        title={t('onboarding.title')}
        subtitle={t('onboarding.step', { current: step + 1, total: STEP_COUNT })}
      />
      <div className="grid max-w-2xl gap-5">
        {step === 0 && (
          <fieldset disabled={isPending}>
            <ProfileIdentity
              universityId={profile.universityId}
              disabled={isPending}
              showAccountActions={false}
              onRemoveBanner={async () => {
                if (form.getValues('banner')) await deleteBanner();
                form.resetField('banner', { defaultValue: '' });
                form.resetField('bannerFile');
              }}
            />
          </fieldset>
        )}
        {step === 1 && (
          <UIPanel surface="tint" className="rounded-profile">
            <form onSubmit={saveDetails}>
              <fieldset disabled={isPending}>
                <PersonalDetails />
              </fieldset>
            </form>
          </UIPanel>
        )}
        {step === 2 && (
          <UIPanel surface="tint" className="rounded-profile">
            <StudyProgrammes universityId={profile.universityId} />
          </UIPanel>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-3">
            {step > 0 && (
              <UIButton bg="secondary" disabled={isPending} onClick={() => setStep(step - 1)}>
                {t('app.back')}
              </UIButton>
            )}
          </div>
          <div className="flex gap-3">
            {!isLast && (
              <UIButton bg="transparent" disabled={isPending} onClick={goToFeed}>
                {t('onboarding.skip')}
              </UIButton>
            )}
            <UIButton
              disabled={isPending}
              onClick={() => {
                if (isLast) goToFeed();
                else if (step === 1) void saveDetails();
                else setStep(step + 1);
              }}
            >
              {isLast ? t('onboarding.finish') : t('onboarding.next')}
            </UIButton>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
