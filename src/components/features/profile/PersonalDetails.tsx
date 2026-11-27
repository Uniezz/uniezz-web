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
    { value: 'female', label: t('students.genderFemale') },
    { value: 'male', label: t('students.genderMale') },
  ] as const;
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
        <UIField
          label={t('students.gender')}
          labelAs="div"
          hint={savedGender ? undefined : t('students.genderHint')}
        >
          {savedGender ? (
            <p className="text-base font-medium">
              {genders.find((option) => option.value === savedGender)?.label}
            </p>
          ) : (
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <UISegmented
                  options={genders.map((option) => option.label)}
                  value={genders.find((option) => option.value === field.value)?.label ?? ''}
                  onChange={(label) =>
                    field.onChange(genders.find((option) => option.label === label)?.value)
                  }
                  label={t('students.gender')}
                />
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
