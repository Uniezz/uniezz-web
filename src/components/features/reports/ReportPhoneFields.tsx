import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { ReportSchema } from '@/schemas';
import { cn } from '@/ui/cn';
import { UIButton, UIRowGroup } from '@/ui/components';
import { rowRadioStyles } from '@/ui/components/UIRow/variants';
import { REPORT_REASONS } from '@/utils';

/** The mobile app's ReportSheet fields: an inset radio list, a details field and one pinned submit. */
export function ReportPhoneFields({
  control,
  register,
  errors,
  isPending,
}: {
  control: Control<ReportSchema>;
  register: UseFormRegister<ReportSchema>;
  errors: FieldErrors<ReportSchema>;
  isPending: boolean;
}) {
  const { t } = useTranslation();
  return (
    <fieldset disabled={isPending} className="flex flex-col gap-3.5">
      <Controller
        name="reason"
        control={control}
        render={({ field }) => (
          <UIRowGroup label={t('report.reason')}>
            {REPORT_REASONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={field.value === value}
                data-ph-capture-attribute-label="Pick report reason"
                onClick={() => field.onChange(value)}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-xl border px-3 py-3.5 text-left text-base font-semibold focus-visible:outline-2 focus-visible:outline-blue',
                  field.value === value
                    ? 'border-white-20 bg-white-5'
                    : 'border-transparent border-b-white-5 last:border-b-transparent',
                )}
              >
                {t(label)}
                <span className={rowRadioStyles({ selected: field.value === value })} aria-hidden>
                  {field.value === value && <span className="size-2.5 rounded-full bg-sky" />}
                </span>
              </button>
            ))}
          </UIRowGroup>
        )}
      />
      <label className="flex flex-col gap-2">
        <span className="text-detail font-semibold">{t('report.details')}</span>
        <textarea
          className="app-control h-37.5 resize-none text-base"
          {...register('details')}
          maxLength={1000}
          aria-invalid={Boolean(errors.details)}
        />
        {errors.details && (
          <span className="text-detail font-semibold text-red">{t('report.detailsError')}</span>
        )}
      </label>
      {/* the sheet's pinned footer: one full-width submit over a fade */}
      <div className="sticky bottom-0 -mx-4 bg-linear-to-b from-transparent to-surface to-30% px-4 pt-4">
        <UIButton type="submit" className="w-full text-section">
          {t('report.submit')}
        </UIButton>
      </div>
    </fieldset>
  );
}
