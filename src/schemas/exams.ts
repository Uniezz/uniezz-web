import { z } from 'zod';
import { optionalSearchStringSchema } from './routeSearch';

export const uploadSchema = z.object({
  subject: z.string().trim().min(1).max(120),
  university: z.string().trim().min(1),
  type: z.enum(['Exam', 'Colloquium', 'Lab reports', 'Notes']),
});

export type UploadSchema = z.infer<typeof uploadSchema>;

/** Exams filters live in the URL; bad values fall back to "any" instead of failing the page. */
export const examsSearchSchema = z.object({
  tab: z.enum(['papers', 'reviews', 'professors', 'mine']).optional().catch(undefined),
  university: z.string().max(40).optional().catch(undefined),
  semester: z.coerce.number().int().min(1).max(12).optional().catch(undefined),
  q: optionalSearchStringSchema,
});

export type ExamsSearch = z.infer<typeof examsSearchSchema>;
