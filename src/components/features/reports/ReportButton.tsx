import { ApiRequestError } from '@/api/errors';
import { captureAnalytics } from '@/utils/analytics';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FlagTriangleRight } from 'lucide-react';
import toast from 'react-hot-toast';

import type { components } from '@/@types/schema';
import { useCreateReport } from '@/hooks/useCreateReport';
import { reportSchema, type ReportSchema } from '@/schemas';
import { UIButton, UIDialog, UIField, UISelect } from '@/ui/components';

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
  const { mutateAsync: createReport, isPending, reset: resetMutation } = useCreateReport();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ReportSchema>({
    resolver: zodResolver(reportSchema),
    defaultValues: { details: '' },
    mode: 'onBlur',
  });
  const details = useWatch({ control, name: 'details' }) ?? '';
  const label =
    targetType === 'post'
      ? t('report.post')
      : targetType === 'comment'
        ? t('report.comment')
        : targetType === 'course'
          ? t('report.course')
          : targetType === 'file'
            ? t('report.material')
            : targetType === 'candidate'
              ? t('report.candidate')
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
        size="pill"
        className={
          compact
            ? 'min-h-0 gap-1.5 rounded-full border border-danger/25 bg-danger-soft py-1 pr-2.5 pl-2 text-micro font-semibold text-danger backdrop-blur-md enabled:hover:border-danger/50 enabled:hover:bg-danger/25'
            : 'min-h-0 gap-1 border-0 p-0 text-secondary enabled:hover:bg-transparent enabled:hover:text-white'
        }
        onClick={() => changeOpen(true)}
      >
        <FlagTriangleRight className="size-3.5" aria-hidden="true" />
        {label}
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
          onSubmit={handleSubmit(
            async ({ reason, details }) => {
              try {
                await createReport({ targetType, targetId, reason, details: details || undefined });
                changeOpen(false);
                toast.success(t('report.sent'));
              } catch (error) {
                const status = error instanceof ApiRequestError ? error.status : undefined;
                toast.error(
                  t(
                    status === 409
                      ? 'report.duplicate'
                      : status === 429
                        ? 'report.rateLimit'
                        : 'apiState.error',
                  ),
                );
              }
            },
            () => captureAnalytics('report_form_validation_failed'),
          )}
        >
          <fieldset disabled={isPending} className="space-y-4">
            <UIField
              label={t('report.reason')}
              error={errors.reason ? t('app.required') : undefined}
            >
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <UISelect
                    label={t('report.reason')}
                    className="app-control"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    options={[
                      { value: '', label: t('report.selectReason') },
                      ...reasons.map(({ value, label: reasonLabel }) => ({
                        value,
                        label: t(reasonLabel),
                      })),
                    ]}
                  />
                )}
              />
            </UIField>
            <UIField
              label={t('report.details')}
              error={errors.details && t('report.detailsError')}
              maxLength={1000}
              count={details.length}
            >
              <textarea
                className="app-control h-28 resize-none"
                {...register('details')}
                maxLength={1000}
                aria-invalid={Boolean(errors.details)}
              />
            </UIField>
          </fieldset>
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
