import { useTranslation } from 'react-i18next';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import type { PostSchema } from '@/schemas';
import { UIField } from '@/ui/components';

export function PostEventDetails({
  register,
  errors,
}: {
  register: UseFormRegister<PostSchema>;
  errors: FieldErrors<PostSchema>;
}) {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="event-details-heading"
      className="space-y-4 rounded-feature border border-white-10 bg-white-5 p-4"
    >
      <h2 id="event-details-heading" className="text-micro font-semibold text-secondary">
        {t('postComposer.eventDetails')}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <UIField label={t('postComposer.date')} error={errors.date ? t('app.required') : undefined}>
          <input
            autoComplete="off"
            {...register('date')}
            type="date"
            className="app-control [color-scheme:dark]"
            aria-invalid={Boolean(errors.date)}
          />
        </UIField>
        <UIField label={t('postComposer.time')} error={errors.time ? t('app.required') : undefined}>
          <input
            autoComplete="off"
            {...register('time')}
            type="time"
            className="app-control [color-scheme:dark]"
            aria-invalid={Boolean(errors.time)}
          />
        </UIField>
      </div>
    </section>
  );
}
