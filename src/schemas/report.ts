import { z } from 'zod';

export const reportSchema = z.object({
  reason: z.enum(['spam', 'harassment', 'inappropriate', 'hate_speech', 'other']),
  details: z.string().trim().max(1000),
});

export type ReportSchema = z.infer<typeof reportSchema>;
