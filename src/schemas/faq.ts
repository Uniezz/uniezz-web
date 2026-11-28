import { z } from 'zod';

// the messages are translation keys, shown under the fields on a phone
export const faqProposalSchema = z.object({
  question: z.string().trim().min(3, 'faq.questionError').max(200, 'faq.questionError'),
  answer: z.string().trim().min(1, 'faq.answerError').max(2000, 'faq.answerError'),
});

export type FaqProposalFormSchema = z.infer<typeof faqProposalSchema>;

/** A published question has its text in every interface language. */
export const faqTextsSchema = z.object({
  pl: faqProposalSchema,
  en: faqProposalSchema,
  uk: faqProposalSchema,
  ru: faqProposalSchema,
  be: faqProposalSchema,
  de: faqProposalSchema,
  es: faqProposalSchema,
});

export type FaqTextsFormSchema = z.infer<typeof faqTextsSchema>;
