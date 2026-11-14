import { z } from 'zod';

const MIN_AGE = 16;

/** ISO date (yyyy-mm-dd) at least MIN_AGE years ago. */
export const birthDateSchema = z.object({
  birthDate: z.iso.date().refine((value) => {
    const latest = new Date();
    latest.setFullYear(latest.getFullYear() - MIN_AGE);
    // ISO dates compare correctly as strings.
    return value <= latest.toISOString().slice(0, 10);
  }),
});

export type BirthDateFormSchema = z.infer<typeof birthDateSchema>;
