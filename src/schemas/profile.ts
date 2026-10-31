import { z } from 'zod';

export const profileSchema = z.object({
  first: z.string().trim().min(1).max(80),
  last: z.string().trim().min(1).max(80),
});
export type ProfileSchema = z.infer<typeof profileSchema>;

export const programmeSchema = z.object({
  id: z.string().optional(),
  programme: z.string().trim().min(1),
  faculty: z.string().trim().min(1),
  yearOfStudy: z.number().int().min(1).max(10).nullable(),
  isPrimary: z.boolean(),
  status: z.enum(['active', 'graduated', 'suspended', 'cancelled']),
  level: z
    .enum(['first_cycle', 'second_cycle', 'long_cycle', 'third_cycle', 'phd_school'])
    .nullable(),
  modeOfStudies: z.enum(['full_time', 'part_time']).nullable(),
});
export const profileFormSchema = profileSchema.extend({
  privacy: z.object({ showEmail: z.boolean(), showFaculty: z.boolean(), showYear: z.boolean() }),
  photo: z.string(),
  avatarFile: z
    .file()
    .min(1)
    .max(5 * 1024 * 1024)
    .mime(['image/jpeg', 'image/png', 'image/webp'])
    .optional(),
});
export type ProfileFormSchema = z.infer<typeof profileFormSchema>;
export type ProgrammeFormSchema = z.infer<typeof programmeSchema>;
