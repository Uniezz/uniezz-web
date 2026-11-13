import { z } from 'zod';

export const faqProposalSchema = z.object({
  question: z.string().trim().min(3).max(200),
  answer: z.string().trim().min(1).max(2000),
});

export type FaqProposalFormSchema = z.infer<typeof faqProposalSchema>;
