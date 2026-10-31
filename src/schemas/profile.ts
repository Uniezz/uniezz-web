import { z } from 'zod';

export const profileSchema = z.object({
  first: z.string().trim().min(1).max(80),
  last: z.string().trim().min(1).max(80),
});

export type ProfileSchema = z.infer<typeof profileSchema>;

export const programmeSchema = z.object({
  name: z.string().trim().min(1),
  faculty: z.string().trim().min(1),
  year: z.string().min(1),
  primary: z.boolean(),
});
export const profileFormSchema = profileSchema.extend({
  visible: z.boolean(),
  photo: z.string().min(1),
  programmes: z.array(programmeSchema),
});
export type ProfileFormSchema = z.infer<typeof profileFormSchema>;
