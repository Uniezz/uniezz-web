import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { UIEmojiPicker, UIField, UIPanel } from '@/ui/components';
import { type ProfileFormSchema } from '@/schemas';

export function PersonalDetails() {
  const { t } = useTranslation();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProfileFormSchema>();
  const [first = '', last = '', bio = ''] = useWatch({ control, name: ['first', 'last', 'bio'] });
  return (
    <UIPanel surface="tint" className="rounded-profile">
      <h2 className="mb-4 text-md font-bold">{t('app.personalDetails')}</h2>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <UIField
          label={t('app.firstName')}
          error={errors.first && t('app.required')}
          maxLength={100}
          count={first.length}
        >
          <input
            className="app-control"
            {...register('first')}
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
            {...register('last')}
            autoComplete="off"
            maxLength={100}
            aria-invalid={Boolean(errors.last)}
          />
        </UIField>
      </div>
      <div className="mt-4 space-y-4">
        <UIField
          label={t('students.bio')}
          error={errors.bio && t('students.bioError')}
          maxLength={500}
          count={bio.length}
        >
          <textarea
            className="app-control h-28 resize-none"
            {...register('bio')}
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
      </div>
    </UIPanel>
  );
}
