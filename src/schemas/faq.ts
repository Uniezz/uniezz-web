import { z } from 'zod';

export const faqProposalSchema = z.object({
  question: z.string().trim().min(3).max(200),
  answer: z.string().trim().min(1).max(2000),
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
