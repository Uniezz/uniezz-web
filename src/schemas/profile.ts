import { z } from 'zod';

export const profileSchema = z.object({
  first: z.string().trim().min(1).max(100),
  last: z.string().trim().min(1).max(100),
});

export const programmeSchema = z.object({
  id: z.string().optional(),
  programme: z.string().trim().min(1),
  faculty: z.string().trim().min(1),
  yearOfStudy: z.number().int().min(1).max(6).nullable(),
  isPrimary: z.boolean(),
  status: z.enum(['active', 'graduated', 'suspended', 'cancelled']),
  level: z
    .enum(['first_cycle', 'second_cycle', 'long_cycle', 'third_cycle', 'phd_school'])
    .nullable(),
  modeOfStudies: z.enum(['full_time', 'part_time']).nullable(),
});
export const addProgrammeSchema = programmeSchema.pick({ programme: true, faculty: true });

export const avatarImageSchema = z
  .file()
  .min(1)
  .max(5 * 1024 * 1024)
  .mime(['image/jpeg', 'image/png', 'image/webp']);

export const bannerImageSchema = z
  .file()
  .min(1)
  .max(10 * 1024 * 1024)
  .mime(['image/jpeg', 'image/png', 'image/webp']);

export const profileFormSchema = profileSchema.extend({
  privacy: z.object({ showEmail: z.boolean(), showFaculty: z.boolean(), showYear: z.boolean() }),
  photo: z.string(),
  bio: z
    .string()
    .max(500)
    .transform((value) => value.trim()),
  interests: z
    .string()
    .transform((value) =>
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string().max(30)).max(10)),
  avatarFile: avatarImageSchema.optional(),
  banner: z.string(),
  bannerFile: bannerImageSchema.optional(),
  /** An empty string clears the song; otherwise http or https only, like the API. */
  song: z
    .string()
    .trim()
    .max(500)
    .pipe(z.union([z.literal(''), z.url({ protocol: /^https?$/ })])),
});
export type ProfileFormSchema = z.input<typeof profileFormSchema>;
export type ProfileSubmission = z.output<typeof profileFormSchema>;
export type ProgrammeFormSchema = z.infer<typeof programmeSchema>;
