import { ApiRequestError } from '@/api';
import { captureAnalytics, toast } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { components } from '@/@types/schema';
import { useCreateReport } from '@/hooks';
import { reportSchema, type ReportSchema } from '@/schemas';
import { UIButton, UIDialog, UIField, UISelect } from '@/ui/components';

const reasons = [
  { value: 'spam', label: 'report.spam' },
  { value: 'harassment', label: 'report.harassment' },
  { value: 'inappropriate', label: 'report.inappropriate' },
  { value: 'hate_speech', label: 'report.hateSpeech' },
  { value: 'other', label: 'report.other' },
] as const;

export type ReportTargetType = components['schemas']['CreateReportInputBody']['targetType'];

export function ReportDialog({
  open,
  onClose,
  title,
  targetType,
  targetId,
}: {
  open: boolean;
  onClose: VoidFunction;
  title: string;
  targetType: ReportTargetType;
  targetId: string;
}) {
  const { t } = useTranslation();
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

  function close() {
    onClose();
    reset();
    resetMutation();
  }

  return (
    <UIDialog
      open={open}
      onOpenChange={close}
      dismissible={!isPending}
      title={title}
      description={t('report.description')}
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(
          async ({ reason, details }) => {
            try {
              await createReport({ targetType, targetId, reason, details: details || undefined });
              close();
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
          <UIField label={t('report.reason')} error={errors.reason ? t('app.required') : undefined}>
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
          <UIButton bg="secondary" disabled={isPending} onClick={close}>
            {t('postComposer.cancel')}
          </UIButton>
          <UIButton type="submit" disabled={isPending}>
            {t('report.submit')}
          </UIButton>
        </div>
      </form>
    </UIDialog>
  );
}
