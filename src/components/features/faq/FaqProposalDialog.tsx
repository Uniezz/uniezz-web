import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiErrorKey, toast } from '@/utils';
import { useCreateFaqProposal, usePhoneViewport } from '@/hooks';
import { faqProposalSchema, type FaqProposalFormSchema } from '@/schemas';
import { UIButton, UIDialog, UIDialogFooter, UIField } from '@/ui/components';
import { cn } from '@/ui/cn';

export function FaqProposalDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const formId = useId();
  const isPhone = usePhoneViewport();
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const { mutateAsync: createProposal, isPending } = useCreateFaqProposal();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FaqProposalFormSchema>({
    resolver: zodResolver(faqProposalSchema),
    defaultValues: { question: '', answer: '' },
  });
  // the app's sheet: the schema's message per field; desktop keeps "Required"
  const errorText = (message?: string) =>
    message ? (isPhone ? t(message as 'faq.questionError') : t('app.required')) : undefined;

  async function submit(values: FaqProposalFormSchema) {
    try {
      await createProposal(values);
      reset();
      toast.success(t('faq.proposalSent'));
      onClose();
    } catch (error) {
      toast.error(t(apiErrorKey(error)));
    }
  }

  // on a phone, as the app's sheet: closing with text asks first, and a closed sheet starts over
  const handleOpenChange = (next: boolean) => {
    if (next) return;
    if (isPhone && isDirty && !isPending) return setIsDiscardOpen(true);
    if (isPhone) reset();
    onClose();
  };
  const handleKeepEditing = () => setIsDiscardOpen(false);
  const handleDiscard = () => {
    setIsDiscardOpen(false);
    reset();
    onClose();
  };

  return (
    <>
      <UIDialog
        placement="right"
        // a bottom sheet on a phone, as the mobile app's form sheets
        sheet
        open={open}
        onOpenChange={handleOpenChange}
        title={t(isPhone ? 'faq.propose' : 'faq.proposeTitle')}
        description={isPhone ? undefined : t('faq.proposeDescription')}
        // the footer below pads the sheet's bottom itself, as the other form sheets
        className="max-lg:pb-0"
        footer={
          isPhone ? (
            // pinned below the fields over a surface gradient, as the app's UIFormSheet
            <div className="sticky bottom-0 z-10 -mx-4 mt-2 flex bg-linear-to-t from-surface from-70% to-surface/0 px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]">
              <UIButton type="submit" form={formId} disabled={isPending} className="flex-1">
                {t('faq.proposalSubmit')}
              </UIButton>
            </div>
          ) : (
            <UIDialogFooter>
              <UIButton bg="secondary" onClick={onClose} disabled={isPending}>
                {t('app.cancel')}
              </UIButton>
              <UIButton type="submit" form={formId} disabled={isPending}>
                {t('faq.submitProposal')}
              </UIButton>
            </UIDialogFooter>
          )
        }
      >
        <form
          id={formId}
          className="flex min-h-0 flex-1 flex-col gap-4 max-lg:mt-4 max-lg:gap-3.5"
          onSubmit={handleSubmit(submit)}
        >
          {isPhone && <p className="text-detail text-secondary">{t('faq.proposalDescription')}</p>}
          <UIField label={t('faq.question')} error={errorText(errors.question?.message)}>
            {isPhone ? (
              <textarea
                autoComplete="off"
                className="app-control h-24 resize-none"
                maxLength={200}
                {...register('question')}
              />
            ) : (
              <input
                autoComplete="off"
                className="app-control"
                maxLength={200}
                placeholder={t('faq.questionPlaceholder')}
                {...register('question')}
              />
            )}
          </UIField>
          <UIField label={t('faq.answer')} error={errorText(errors.answer?.message)}>
            <textarea
              className={cn('app-control resize-none', isPhone ? 'h-37.5' : 'h-62.5')}
              maxLength={2000}
              placeholder={isPhone ? undefined : t('faq.answerPlaceholder')}
              {...register('answer')}
            />
          </UIField>
        </form>
      </UIDialog>
      <UIDialog
        open={isDiscardOpen}
        onOpenChange={setIsDiscardOpen}
        title={t('app.unsavedChangesTitle')}
        description={t('app.discardChangesDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" onClick={handleKeepEditing}>
            {t('app.keepEditing')}
          </UIButton>
          <UIButton bg="danger" onClick={handleDiscard}>
            {t('app.discardChanges')}
          </UIButton>
        </div>
      </UIDialog>
    </>
  );
}
