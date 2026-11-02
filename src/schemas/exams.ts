import { z } from 'zod';

export const uploadSchema = z.object({
  subject: z.string().trim().min(1).max(120),
  university: z.string().trim().min(1),
  type: z.enum(['Exam', 'Colloquium', 'Lab reports', 'Notes']),
});

export type UploadSchema = z.infer<typeof uploadSchema>;
