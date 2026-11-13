import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useCreateFaqProposal } from '@/hooks';
import { faqProposalSchema, type FaqProposalFormSchema } from '@/schemas';
import { UIButton, UIDialog, UIField } from '@/ui/components';

export function FaqProposalDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const { mutateAsync: createProposal, isPending } = useCreateFaqProposal();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaqProposalFormSchema>({
    resolver: zodResolver(faqProposalSchema),
    defaultValues: { question: '', answer: '' },
  });

  async function submit(values: FaqProposalFormSchema) {
    try {
      await createProposal(values);
      reset();
      toast.success(t('faq.proposalSent'));
      onClose();
    } catch {
      toast.error(t('apiState.error'));
    }
  }

  return (
    <UIDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      title={t('faq.proposeTitle')}
      description={t('faq.proposeDescription')}
    >
      <form className="space-y-4" onSubmit={handleSubmit(submit)}>
        <UIField label={t('faq.question')} error={errors.question ? t('app.required') : undefined}>
          <input
            autoComplete="off"
            className="app-control"
            maxLength={200}
            placeholder={t('faq.questionPlaceholder')}
            {...register('question')}
          />
        </UIField>
        <UIField label={t('faq.answer')} error={errors.answer ? t('app.required') : undefined}>
          <textarea
            className="app-control min-h-28 resize-y"
            maxLength={2000}
            placeholder={t('faq.answerPlaceholder')}
            {...register('answer')}
          />
        </UIField>
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" onClick={onClose} disabled={isPending}>
            {t('app.cancel')}
          </UIButton>
          <UIButton type="submit" disabled={isPending}>
            {t('faq.submitProposal')}
          </UIButton>
        </div>
      </form>
    </UIDialog>
  );
}
