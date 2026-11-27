import { Mars, Venus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { UIEmojiPicker, UIField, UISegmented } from '@/ui/components';
import { type ProfileFormSchema } from '@/schemas';

export function PersonalDetails({ showHeading = true }: { showHeading?: boolean }) {
  const { t } = useTranslation();
  const {
    register,
    control,
    setValue,
    formState: { errors, defaultValues },
  } = useFormContext<ProfileFormSchema>();
  const [first = '', last = '', bio = '', song = ''] = useWatch({
    control,
    name: ['first', 'last', 'bio', 'song'],
  });
  const savedGender = defaultValues?.gender;
  const genders = [
    {
      value: 'female',
      label: t('students.genderFemale'),
      icon: <Venus className="size-4 text-pink" aria-hidden="true" />,
    },
    {
      value: 'male',
      label: t('students.genderMale'),
      icon: <Mars className="size-4 text-blue" aria-hidden="true" />,
    },
  ] as const;
  const saved = genders.find((option) => option.value === savedGender);
  return (
    <div>
      {showHeading && <h2 className="mb-4 text-md font-bold">{t('app.personalDetails')}</h2>}
      <div className="grid gap-3.5 sm:grid-cols-2">
        <UIField
          label={t('app.firstName')}
          error={errors.first && t('app.required')}
          maxLength={100}
          count={first.length}
        >
          <input
            className="app-control"
            {...register('first', {
              onBlur: (e) => setValue('first', e.target.value.trim(), { shouldValidate: true }),
            })}
            autoComplete="off"
            maxLength={100}
            aria-invalid={Boolean(errors.first)}
          />
        </UIField>
        <UIField
          label={t('app.lastName')}
          error={errors.last && t('app.required')}
          maxLength={100}
          count={last.length}
        >
          <input
            className="app-control"
            {...register('last', {
              onBlur: (e) => setValue('last', e.target.value.trim(), { shouldValidate: true }),
            })}
            autoComplete="off"
            maxLength={100}
            aria-invalid={Boolean(errors.last)}
          />
        </UIField>
      </div>
      <div className="mt-4 space-y-4">
        <UIField label={t('students.gender')} labelAs="div">
          {saved ? (
            <p className="flex items-center gap-1.5 text-base font-medium">
              {saved.icon}
              {saved.label}
            </p>
          ) : (
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <UISegmented
                    options={genders.map((option) => option.label)}
                    value={genders.find((option) => option.value === field.value)?.label ?? ''}
                    // Clicking the chosen option again clears it, so a misclick can be undone before saving.
                    onChange={(label) => {
                      const option = genders.find((option) => option.label === label);
                      field.onChange(
                        option?.value === field.value ? null : (option?.value ?? null),
                      );
                    }}
                    label={t('students.gender')}
                    icons={Object.fromEntries(genders.map((option) => [option.label, option.icon]))}
                  />
                  <p className="text-label font-medium text-warning">{t('students.genderHint')}</p>
                </div>
              )}
            />
          )}
        </UIField>
        <UIField
          label={t('students.bio')}
          error={errors.bio && t('students.bioError')}
          maxLength={500}
          count={bio.length}
        >
          <textarea
            className="app-control h-28 resize-none"
            {...register('bio')}
            placeholder={t('students.bioPlaceholder')}
            maxLength={500}
            aria-invalid={Boolean(errors.bio)}
          />
          <UIEmojiPicker align="start" className="absolute bottom-0.5 left-1" />
        </UIField>
        <UIField
          label={t('students.interests')}
          hint={t('students.interestsError')}
          error={errors.interests && t('students.interestsError')}
        >
          <input
            className="app-control"
            {...register('interests')}
            placeholder={t('students.interestsHint')}
            autoComplete="off"
            aria-invalid={Boolean(errors.interests)}
          />
        </UIField>
        <UIField
          label={t('students.song')}
          hint={t('students.songHint')}
          error={errors.song && t('students.songError')}
          maxLength={500}
          count={song.length}
        >
          <input
            className="app-control"
            {...register('song')}
            placeholder={t('students.songPlaceholder')}
            autoComplete="off"
            aria-invalid={Boolean(errors.song)}
          />
        </UIField>
      </div>
    </div>
  );
}
