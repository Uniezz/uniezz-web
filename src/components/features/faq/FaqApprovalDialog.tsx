import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FaqEntry, FaqLanguage } from '@/@types';
import { useApproveFaqProposal } from '@/hooks';
import { faqTextsSchema, type FaqTextsFormSchema } from '@/schemas';
import { UIButton, UIDialog, UIDialogFooter, UIField, UISubTabs } from '@/ui/components';
import { LNG_OPTIONS, toast } from '@/utils';

const empty = { question: '', answer: '' };

/** A moderator writes the proposal in every language before it is published. */
export function FaqApprovalDialog({
  proposal,
  onClose,
}: {
  proposal: FaqEntry;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const formId = useId();
  const [language, setLanguage] = useState<FaqLanguage>(proposal.language);
  const { mutateAsync: approve, isPending } = useApproveFaqProposal();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FaqTextsFormSchema>({
    resolver: zodResolver(faqTextsSchema),
    defaultValues: {
      pl: empty,
      en: empty,
      uk: empty,
      ru: empty,
      be: empty,
      de: empty,
      es: empty,
      [proposal.language]: { question: proposal.question, answer: proposal.answer },
    },
  });
  const tabs = LNG_OPTIONS.map(({ value, label }) => ({
    id: value as FaqLanguage,
    label: errors[value as FaqLanguage] ? `${label} •` : label,
  }));

  async function submit(texts: FaqTextsFormSchema) {
    try {
      await approve({ id: proposal.id, texts });
      toast.success(t('faq.approved'));
      onClose();
    } catch {
      toast.error(t('apiState.error'));
    }
  }

  return (
    <UIDialog
      placement="right"
      open
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      dismissible={!isPending}
      title={t('faq.translateTitle')}
      description={t('faq.translateDescription')}
      footer={
        <UIDialogFooter>
          <UIButton bg="secondary" onClick={onClose} disabled={isPending}>
            {t('app.cancel')}
          </UIButton>
          <UIButton type="submit" form={formId} disabled={isPending}>
            {t('faq.approve')}
          </UIButton>
        </UIDialogFooter>
      }
    >
      <form
        id={formId}
        className="flex min-h-0 flex-1 flex-col gap-4"
        onSubmit={handleSubmit(submit, (invalid) =>
          // Hidden tabs can't show their errors, so open the first language that needs work.
          setLanguage(tabs.find(({ id }) => invalid[id])?.id ?? language),
        )}
      >
        <UISubTabs
          tabs={tabs}
          value={language}
          onChange={setLanguage}
          label={t('faq.translateTitle')}
          idPrefix="faq-translation"
          className="shrink-0"
        />
        <div
          key={language}
          id="faq-translation-tab-panel"
          role="tabpanel"
          aria-labelledby={`faq-translation-tab-${language}`}
          className="flex min-h-0 flex-1 flex-col gap-4"
        >
          <UIField
            label={t('faq.question')}
            error={errors[language]?.question ? t('app.required') : undefined}
          >
            <input
              autoComplete="off"
              className="app-control"
              maxLength={200}
              {...register(`${language}.question`)}
            />
          </UIField>
          <UIField
            label={t('faq.answer')}
            error={errors[language]?.answer ? t('app.required') : undefined}
          >
            <textarea
              className="app-control h-62.5 resize-none"
              maxLength={2000}
              {...register(`${language}.answer`)}
            />
          </UIField>
        </div>
      </form>
    </UIDialog>
  );
}
