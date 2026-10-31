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
          <input
            className="app-control"
            {...register('first')}
            autoComplete="given-name"
            maxLength={80}
          />
        </UIField>
        <UIField label={t('app.lastName')} error={errors.last ? t('app.required') : undefined}>
          <input
            className="app-control"
            {...register('last')}
            autoComplete="family-name"
            maxLength={80}
          />
        </UIField>
      </div>
    </UIPanel>
  );
}
