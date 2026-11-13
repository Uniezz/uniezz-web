import { z } from 'zod';
import { optionalSearchStringSchema } from './routeSearch';

export const studyMaterialFileSchema = z
  .file()
  .min(1)
  .mime(['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
  .refine((file) => file.size <= (file.type === 'application/pdf' ? 20 : 10) * 1024 * 1024);
export const uploadSchema = z.object({
  type: z.enum(['exam', 'colloquium', 'lab', 'notes']),
  files: z.array(studyMaterialFileSchema).min(1).max(10),
});

/** Exams filters live in the URL; bad values fall back to "any" instead of failing the page. */
export const examsSearchSchema = z.object({
  tab: z.enum(['reviews', 'professors', 'mine']).optional().catch(undefined),
  university: z.string().max(40).optional().catch(undefined),
  semester: z.coerce.number().int().min(1).max(12).optional().catch(undefined),
  q: optionalSearchStringSchema,
});

const courseNameSchema = z.string().trim().min(3).max(150);
export const editCourseSchema = z.object({
  name: courseNameSchema,
  description: z.string().trim().min(1).max(5000),
  difficulty: z.number().int().min(1).max(5),
});
export const createCourseSchema = editCourseSchema.extend({
  universityId: z.string().trim().min(1).max(32),
  faculty: courseNameSchema,
  subject: courseNameSchema,
  semester: z.number().int().min(1).max(12),
});
export const createCourseFormSchema = createCourseSchema.extend({
  materials: z.array(studyMaterialFileSchema).max(10),
  materialType: z.enum(['exam', 'colloquium', 'lab', 'notes']),
});

export const courseCommentSchema = z.object({ content: z.string().trim().min(1).max(1000) });
