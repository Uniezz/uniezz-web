import { ApiRequestError } from '@/api';
import { captureAnalytics, toast } from '@/utils';
import { useState, type ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FlagTriangleRight } from 'lucide-react';

import type { components } from '@/@types/schema';
import { useCreateReport, usePhoneViewport } from '@/hooks';
import { reportSchema, type ReportSchema } from '@/schemas';
import { UIButton, UIDialog, UIField, UISelect } from '@/ui/components';
import { ReportPhoneFields } from './ReportPhoneFields';

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
  danger = false,
  placement,
  renderTrigger,
  onSent,
}: {
  targetType: components['schemas']['CreateReportInputBody']['targetType'];
  targetId: string;
  compact?: boolean;
  danger?: boolean;
  /** `bottom`: the mobile app's ReportSheet on a phone. */
  placement?: 'center' | 'bottom';
  /** Replaces the default button; gets the report's accessible name and the opener. */
  renderTrigger?: (props: { label: string; onOpen: () => void }) => ReactNode;
  /** Runs after the report is sent, such as refetching the deck. */
  onSent?: () => void;
}) {
  const { t } = useTranslation();
  const isPhone = usePhoneViewport();
  const [open, setOpen] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const { mutateAsync: createReport, isPending, reset: resetMutation } = useCreateReport();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<ReportSchema>({
    resolver: zodResolver(reportSchema),
    // the mobile app's sheet starts on Spam
    defaultValues: { details: '', reason: isPhone ? 'spam' : undefined },
    mode: 'onBlur',
  });
  const details = useWatch({ control, name: 'details' }) ?? '';
  const label =
    targetType === 'post'
      ? t('report.post')
      : targetType === 'comment' || targetType === 'course_comment'
        ? t('report.comment')
        : targetType === 'professor_review'
          ? t('report.review')
          : targetType === 'course'
            ? t('report.course')
            : targetType === 'file'
              ? t('report.material')
              : targetType === 'candidate'
                ? t('report.candidate')
                : targetType === 'message'
                  ? t('report.message')
                  : t('report.user');

  function changeOpen(next: boolean) {
    setOpen(next);
    if (!next) {
      reset();
      resetMutation();
    }
  }

  const handleOpen = () => changeOpen(true);
  // On a phone, as the mobile app's form sheet: closing with edits asks to discard them first.
  const requestOpenChange = (next: boolean) => {
    if (!next && isPhone && isDirty) setIsDiscardOpen(true);
    else changeOpen(next);
  };
  const handleDiscard = () => {
    setIsDiscardOpen(false);
    changeOpen(false);
  };
  return (
    <>
      {renderTrigger ? (
        renderTrigger({ label, onOpen: handleOpen })
      ) : (
        <UIButton
          bg="transparent"
          size="pill"
          className={
            compact
              ? 'min-h-0 gap-1.5 rounded-full border border-danger/25 bg-danger-soft py-1 pr-2.5 pl-2 text-micro font-semibold text-danger backdrop-blur-md enabled:hover:border-danger/50 enabled:hover:bg-danger/25'
              : `min-h-0 gap-1 border-0 p-0 whitespace-nowrap ${danger ? 'text-danger/70 enabled:hover:text-danger' : 'text-secondary enabled:hover:text-white'} enabled:hover:bg-transparent`
          }
          // The button sits next to what it reports, so it only says "Report"; the full name stays for screen readers.
          aria-label={label}
          onClick={() => changeOpen(true)}
        >
          <FlagTriangleRight className="size-3.5" aria-hidden="true" />
          {t('report.action')}
        </UIButton>
      )}
      <UIDialog
        placement={placement ?? (isPhone ? 'bottom' : 'center')}
        open={open}
        onOpenChange={requestOpenChange}
        dismissible={!isPending}
        title={label}
        description={t('report.description')}
        className="max-lg:rounded-t-feature max-lg:px-4 max-lg:[&>p]:mt-3 max-lg:[&>p]:mb-3.5 max-lg:[&>p]:text-detail"
      >
        <form
          className="space-y-4"
          onSubmit={handleSubmit(
            async ({ reason, details }) => {
              try {
                await createReport({ targetType, targetId, reason, details: details || undefined });
                changeOpen(false);
                toast.success(t('report.sent'));
                onSent?.();
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
          {isPhone ? (
            <ReportPhoneFields
              control={control}
              register={register}
              errors={errors}
              isPending={isPending}
            />
          ) : (
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
          )}
          {!isPhone && (
            <div className="flex justify-end gap-3">
              <UIButton bg="secondary" disabled={isPending} onClick={() => changeOpen(false)}>
                {t('postComposer.cancel')}
              </UIButton>
              <UIButton type="submit" disabled={isPending}>
                {t('report.submit')}
              </UIButton>
            </div>
          )}
        </form>
      </UIDialog>
      <UIDialog
        open={isDiscardOpen}
        onOpenChange={setIsDiscardOpen}
        placement="bottom"
        title={t('app.unsavedChangesTitle')}
        description={t('app.discardChangesDescription')}
      >
        <div className="flex justify-end gap-3 max-lg:flex-col-reverse">
          <UIButton bg="secondary" onClick={() => setIsDiscardOpen(false)}>
            {t('postComposer.cancel')}
          </UIButton>
          <UIButton bg="danger" onClick={handleDiscard}>
            {t('app.discardChanges')}
          </UIButton>
        </div>
      </UIDialog>
    </>
  );
}
