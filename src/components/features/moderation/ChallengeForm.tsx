import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ChallengeFormInput, ChallengeFormProps, ChallengeFormSchema } from '@/@types';
import {
  CHALLENGE_ACTIONS,
  CHALLENGE_PERIODS,
  challengeFormValues,
  challengeSchema,
} from '@/schemas';
import { UIField, UISelect } from '@/ui/components';
import { challengeActionLabel, challengePeriodLabels } from '@/utils';

/**
 * The challenge fields; the dialog mounts it on every opening, so it starts from that
 * challenge's values. Action, period and target are set once.
 */
export function ChallengeForm({ id, challenge, onSubmit }: ChallengeFormProps) {
  const { t } = useTranslation();
  const isEditing = Boolean(challenge);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChallengeFormInput, unknown, ChallengeFormSchema>({
    resolver: zodResolver(challengeSchema),
    defaultValues: challengeFormValues(challenge),
  });

  return (
    <form
      id={id}
      className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <UIField label={t('moderation.challengeAction')}>
        <Controller
          control={control}
          name="action"
          render={({ field }) => (
            <UISelect
              label={t('moderation.challengeAction')}
              value={field.value}
              disabled={isEditing}
              onChange={field.onChange}
              options={CHALLENGE_ACTIONS.map((action) => ({
                value: action,
                label: t(challengeActionLabel(action)),
              }))}
            />
          )}
        />
      </UIField>
      <UIField label={t('moderation.challengePeriod')}>
        <Controller
          control={control}
          name="period"
          render={({ field }) => (
            <UISelect
              label={t('moderation.challengePeriod')}
              value={field.value}
              disabled={isEditing}
              onChange={field.onChange}
              options={CHALLENGE_PERIODS.map((period) => ({
                value: period,
                label: t(challengePeriodLabels[period]),
              }))}
            />
          )}
        />
      </UIField>
      <div className="grid grid-cols-2 gap-4">
        <UIField
          label={t('moderation.challengeTarget')}
          error={errors.target ? t('moderation.challengeNumberError') : undefined}
        >
          <input
            type="number"
            min={1}
            max={1000}
            disabled={isEditing}
            className="app-control"
            {...register('target')}
          />
        </UIField>
        <UIField
          label={t('moderation.challengeReward')}
          error={errors.reward ? t('moderation.challengeNumberError') : undefined}
        >
          <input type="number" min={0} max={1000} className="app-control" {...register('reward')} />
        </UIField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <UIField label={t('moderation.challengeStartsAt')}>
          <input
            type="datetime-local"
            className="app-control scheme-dark"
            {...register('startsAt')}
          />
        </UIField>
        <UIField
          label={t('moderation.challengeEndsAt')}
          error={errors.endsAt ? t('moderation.challengeEndsAtError') : undefined}
        >
          <input
            type="datetime-local"
            className="app-control scheme-dark"
            {...register('endsAt')}
          />
        </UIField>
      </div>
      <UIField
        label={t('moderation.challengeTitlePl')}
        error={errors.titlePl ? t('app.required') : undefined}
      >
        <input className="app-control" maxLength={80} {...register('titlePl')} />
      </UIField>
      <UIField label={t('moderation.challengeDescriptionPl')}>
        <textarea
          className="app-control h-24 resize-none"
          maxLength={300}
          {...register('descriptionPl')}
        />
      </UIField>
      <UIField label={t('moderation.challengeTitleEn')}>
        <input className="app-control" maxLength={80} {...register('titleEn')} />
      </UIField>
      <UIField label={t('moderation.challengeDescriptionEn')}>
        <textarea
          className="app-control h-24 resize-none"
          maxLength={300}
          {...register('descriptionEn')}
        />
      </UIField>
    </form>
  );
}
