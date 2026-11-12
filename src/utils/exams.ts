import type { StudyFile } from '@/@types';
import type { components } from '@/@types/schema';
import type { CreateCourseForm } from '@/schemas/exams';

export const studyFileTypeLabels = {
  exam: 'exams.typeExam',
  colloquium: 'exams.typeColloquium',
  lab: 'exams.typeLab',
  notes: 'exams.typeNotes',
} as const satisfies Record<StudyFile['type'], string>;

export function courseFormDefaults(
  profile: components['schemas']['Profile'] | undefined,
): CreateCourseForm {
  const programme =
    profile?.programmes?.find(({ isPrimary }) => isPrimary) ?? profile?.programmes?.[0];
  return {
    name: '',
    description: '',
    universityId: profile?.universityId ?? '',
    faculty: programme?.faculty ?? '',
    subject: programme?.programme ?? '',
    semester: 1,
    difficulty: 3,
  };
}
