import { Controller, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { components } from '@/@types/schema';
import { useProfileForm } from '@/hooks';
import { cn } from '@/ui/cn';
import { UIChip, UIField } from '@/ui/components';
import { apiErrorKey, captureAnalytics, toast } from '@/utils';
import { ProfileFormSheet } from './ProfileFormSheet';

export type PersonalDetailsSheetProps = {
  profile: components['schemas']['Profile'];
  open: boolean;
  onClose: () => void;
};

const FORM_ID = 'personal-details-sheet';

/** The mobile app's PersonalDetailsSheet: names, bio, interests, song and gender, saved together. */
export function PersonalDetailsSheet({ profile, open, onClose }: PersonalDetailsSheetProps) {
  const { t } = useTranslation();
  const { form, saveProfile, isDirty, isPending } = useProfileForm(profile);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;
  // the API rejects changing a saved gender
  const isGenderLocked = Boolean(profile.gender);
  const genders = [
    { value: 'male', label: t('students.genderMale') },
    { value: 'female', label: t('students.genderFemale') },
  ] as const;
  // a closed sheet drops unsaved edits
  const handleClose = () => {
    reset();
    onClose();
  };
  const submit = handleSubmit(
    async (values) => {
      try {
        await saveProfile(values);
        toast.success(t('app.saved'));
        onClose();
      } catch (error) {
        toast.error(t(apiErrorKey(error, 'apiState.profileSaveError')));
      }
    },
    () => captureAnalytics('profile_form_validation_failed'),
  );
  return (
    <FormProvider {...form}>
      <ProfileFormSheet
        open={open}
        onClose={handleClose}
        title={t('app.personalDetails')}
        isDirty={isDirty && !isPending}
        actionLabel={t('app.save')}
        isActionDisabled={!isDirty || isPending}
        formId={FORM_ID}
      >
        <form id={FORM_ID} onSubmit={(event) => void submit(event)} className="contents">
          <fieldset disabled={isPending} className="contents">
            <UIField label={t('app.firstName')} error={errors.first && t('app.required')}>
              <input
                className="app-control"
                autoComplete="off"
                maxLength={100}
                aria-invalid={Boolean(errors.first)}
                {...register('first')}
              />
            </UIField>
            <UIField label={t('app.lastName')} error={errors.last && t('app.required')}>
              <input
                className="app-control"
                autoComplete="off"
                maxLength={100}
                aria-invalid={Boolean(errors.last)}
                {...register('last')}
              />
            </UIField>
            <UIField label={t('students.bio')} error={errors.bio && t('students.bioError')}>
              <textarea
                className="app-control h-28 resize-none"
                maxLength={500}
                aria-invalid={Boolean(errors.bio)}
                {...register('bio')}
              />
            </UIField>
            <UIField
              label={t('students.interests')}
              error={errors.interests && t('students.interestsError')}
            >
              <input
                className="app-control"
                autoComplete="off"
                placeholder={t('students.interestsHint')}
                aria-invalid={Boolean(errors.interests)}
                {...register('interests')}
              />
            </UIField>
            <UIField label={t('students.song')} error={errors.song && t('students.songError')}>
              <input
                className="app-control"
                type="url"
                inputMode="url"
                autoComplete="off"
                placeholder="https://…"
                aria-invalid={Boolean(errors.song)}
                {...register('song')}
              />
            </UIField>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <div role="group" aria-label={t('students.gender')} className="flex flex-col gap-2">
                  <span className="text-micro font-semibold text-secondary">
                    {t('students.gender')}
                  </span>
                  <div className="flex gap-2">
                    {genders.map(({ value, label }) => (
                      <UIChip
                        key={value}
                        selected={field.value === value}
                        disabled={isGenderLocked}
                        onClick={() => field.onChange(value)}
                        data-ph-capture-attribute-label="Pick gender"
                        className={cn(
                          'px-3.5 py-1.75 text-detail font-semibold',
                          field.value === value ? 'border-white' : 'text-white-80',
                          isGenderLocked && field.value !== value && 'opacity-40',
                        )}
                      >
                        {label}
                      </UIChip>
                    ))}
                  </div>
                  {!isGenderLocked && (
                    <p className="text-micro text-secondary">{t('students.genderHint')}</p>
                  )}
                </div>
              )}
            />
          </fieldset>
        </form>
      </ProfileFormSheet>
    </FormProvider>
  );
}
