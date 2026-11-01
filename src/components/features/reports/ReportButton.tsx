import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Flag } from 'lucide-react';
import toast from 'react-hot-toast';

import type { components } from '@/@types/schema';
import { useCreateReport } from '@/hooks/useCreateReport';
import { reportSchema, type ReportSchema } from '@/schemas';
import { UIButton, UIDialog, UIField } from '@/ui/components';

const reasons = [
  { value: 'spam', label: 'report.spam' },
  { value: 'harassment', label: 'report.harassment' },
  { value: 'inappropriate', label: 'report.inappropriate' },
  { value: 'hate_speech', label: 'report.hateSpeech' },
  { value: 'other', label: 'report.other' },
] as const;

export function ReportButton({
  targetType,
  targetId,
  compact = false,
}: {
  targetType: components['schemas']['CreateReportInputBody']['targetType'];
  targetId: string;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutateAsync: createReport, isPending, error, reset: resetMutation } = useCreateReport();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportSchema>({
    resolver: zodResolver(reportSchema),
    defaultValues: { details: '' },
    mode: 'onBlur',
  });
  const label =
    targetType === 'post'
      ? t('report.post')
      : targetType === 'comment'
        ? t('report.comment')
        : t('report.user');

  function changeOpen(next: boolean) {
    setOpen(next);
    if (!next) {
      reset();
      resetMutation();
    }
  }

  return (
    <>
      <UIButton
        bg="transparent"
        size={compact ? 'icon' : 'pill'}
        aria-label={compact ? label : undefined}
        title={compact ? label : undefined}
        className={
          compact
            ? 'size-10 border-white-10 bg-white-5 text-secondary enabled:hover:bg-white-10 enabled:hover:text-white'
            : 'min-h-0 border-0 p-0 text-secondary enabled:hover:bg-transparent enabled:hover:text-white'
        }
        onClick={() => changeOpen(true)}
      >
        {compact ? <Flag className="size-4" aria-hidden="true" /> : label}
      </UIButton>
      <UIDialog
        open={open}
        onOpenChange={changeOpen}
        dismissible={!isPending}
        title={label}
        description={t('report.description')}
      >
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async ({ reason, details }) => {
            try {
              await createReport({ targetType, targetId, reason, details: details || undefined });
              changeOpen(false);
              toast.success(t('report.sent'));
            } catch {
              // The mutation error is shown below the form.
            }
          })}
        >
          <fieldset disabled={isPending} className="space-y-4">
            <UIField
              label={t('report.reason')}
              error={errors.reason ? t('app.required') : undefined}
            >
              <span className="relative block">
                <select
                  className="app-control appearance-none pr-10 focus:border-white-10 focus-visible:border-white-60"
                  defaultValue=""
                  {...register('reason')}
                  aria-invalid={Boolean(errors.reason)}
                >
                  <option value="" disabled>
                    {t('report.selectReason')}
                  </option>
                  {reasons.map(({ value, label: reasonLabel }) => (
                    <option key={value} value={value}>
                      {t(reasonLabel)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-secondary"
                  aria-hidden="true"
                />
              </span>
            </UIField>
            <UIField
              label={t('report.details')}
              error={errors.details ? t('report.detailsError') : undefined}
            >
              <textarea
                className="app-control h-28 resize-none"
                {...register('details')}
                maxLength={1000}
              />
            </UIField>
          </fieldset>
          {error && (
            <p role="alert" className="text-detail text-danger">
              {t(
                error.cause === 409
                  ? 'report.duplicate'
                  : error.cause === 429
                    ? 'report.rateLimit'
                    : 'apiState.error',
              )}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <UIButton bg="secondary" disabled={isPending} onClick={() => changeOpen(false)}>
              {t('postComposer.cancel')}
            </UIButton>
            <UIButton type="submit" disabled={isPending}>
              {t('report.submit')}
            </UIButton>
          </div>
        </form>
      </UIDialog>
    </>
  );
}
