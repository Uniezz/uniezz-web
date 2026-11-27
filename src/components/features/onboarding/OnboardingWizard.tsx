import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import type { components } from '@/@types/schema';
import { AuthLayout } from '@/components/auth';
import { useCompleteOnboarding, useMyProfile, useProfileForm } from '@/hooks';
import { UIButton, UIUnsavedChanges } from '@/ui/components';
import { cn } from '@/ui/cn';
import { apiErrorKey, captureAnalytics, takeReturnPath, toast } from '@/utils';
import { PersonalDetails, StudyProgrammes } from '../profile';
import { ONBOARDING_STEPS, OnboardingAside } from './OnboardingAside';
import { OnboardingPhoto } from './OnboardingPhoto';

export function OnboardingWizard({ profile }: { profile: components['schemas']['Profile'] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { form, saveProfile, isDirty, isPending: isSaving } = useProfileForm(profile);
  const { mutate: completeOnboarding, isPending: isCompleting } = useCompleteOnboarding();
  const isPending = isSaving || isCompleting;
  const { handleSubmit } = form;
  const isLast = step === ONBOARDING_STEPS.length - 1;
  // Skip doesn't save the form, so it waits for a saved name; the loader's profile goes stale after saving.
  const { data: savedProfile } = useMyProfile();
  const canSkip = Boolean(savedProfile?.firstName && savedProfile?.lastName);

  // Photo and details share one form, so they are saved together when leaving the details step.
  const saveDetails = handleSubmit(
    async (data) => {
      try {
        if (isDirty) await saveProfile(data);
        setStep(2);
      } catch (error) {
        toast.error(t(apiErrorKey(error, 'apiState.profileSaveError')));
      }
    },
    () => captureAnalytics('profile_form_validation_failed'),
  );

  function goToFeed() {
    completeOnboarding(undefined, {
      onSuccess: () => void navigate({ href: takeReturnPath() ?? '/feed', replace: true }),
      onError: () => toast.error(t('apiState.error')),
    });
  }

  function next() {
    if (isLast) goToFeed();
    else if (step === 1) void saveDetails();
    else setStep(step + 1);
  }

  return (
    <FormProvider {...form}>
      <UIUnsavedChanges dirty={isDirty} />
      <AuthLayout aside={<OnboardingAside step={step} />}>
        {/* Full panel height on desktop: the progress bar stays on top (below the language switcher) and the buttons at the bottom on every step. */}
        <div className="flex flex-col gap-8 md:min-h-[calc(100svh-6rem)] md:pt-10">
          <div className="flex gap-1.5" aria-hidden>
            {ONBOARDING_STEPS.map((key, index) => (
              <span
                key={key}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors duration-300',
                  index <= step ? 'bg-white' : 'bg-white-10',
                )}
              />
            ))}
          </div>
          {step === 0 && (
            <fieldset disabled={isPending}>
              <OnboardingPhoto />
            </fieldset>
          )}
          {step === 1 && (
            <form onSubmit={saveDetails}>
              <fieldset disabled={isPending}>
                <PersonalDetails showHeading={false} />
              </fieldset>
            </form>
          )}
          {step === 2 && <StudyProgrammes universityId={profile.universityId} />}
          <div className="mt-auto flex items-center gap-2">
            {step > 0 && (
              <UIButton
                bg="ghost"
                size="pill"
                aria-label={t('app.back')}
                disabled={isPending}
                onClick={() => setStep(step - 1)}
                className="size-11 p-0"
              >
                <ArrowLeft size={18} aria-hidden />
              </UIButton>
            )}
            {!isLast && canSkip && (
              <UIButton
                bg="transparent"
                disabled={isPending}
                onClick={goToFeed}
                className="ml-auto text-secondary"
              >
                {t('onboarding.skip')}
              </UIButton>
            )}
            <UIButton
              disabled={isPending}
              onClick={next}
              className={cn((isLast || !canSkip) && 'ml-auto')}
            >
              {isLast ? t('onboarding.finish') : t('onboarding.next')}
              {isLast ? <Check size={18} aria-hidden /> : <ArrowRight size={18} aria-hidden />}
            </UIButton>
          </div>
        </div>
      </AuthLayout>
    </FormProvider>
  );
}
