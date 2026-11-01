import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { UIField, UIPanel } from '@/ui/components';
import { type ProfileFormSchema } from '@/schemas';

export function PersonalDetails() {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext<ProfileFormSchema>();
  return (
    <UIPanel surface="tint" className="rounded-profile">
      <h2 className="mb-4 text-md font-bold">{t('app.personalDetails')}</h2>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <UIField label={t('app.firstName')} error={errors.first ? t('app.required') : undefined}>
          <input className="app-control" {...register('first')} autoComplete="off" maxLength={80} />
        </UIField>
        <UIField label={t('app.lastName')} error={errors.last ? t('app.required') : undefined}>
          <input className="app-control" {...register('last')} autoComplete="off" maxLength={80} />
        </UIField>
      </div>
      <div className="mt-4 space-y-4">
        <UIField label={t('students.bio')} error={errors.bio ? t('students.bioError') : undefined}>
          <textarea className="app-control h-28 resize-none" {...register('bio')} maxLength={500} />
        </UIField>
        <UIField
          label={t('students.interests')}
          error={errors.interests ? t('students.interestsError') : undefined}
        >
          <input
            className="app-control"
            {...register('interests')}
            placeholder={t('students.interestsHint')}
            autoComplete="off"
          />
        </UIField>
      </div>
    </UIPanel>
  );
}
