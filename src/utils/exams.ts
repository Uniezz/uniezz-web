import type { StudyFile, Course, Profile, CreateCourseForm } from '@/@types';

export const studyFileTypeLabels = {
  exam: 'exams.typeExam',
  colloquium: 'exams.typeColloquium',
  lab: 'exams.typeLab',
  notes: 'exams.typeNotes',
} as const satisfies Record<StudyFile['type'], string>;

export function courseFormDefaults(profile: Profile | undefined): CreateCourseForm {
  const programme =
    profile?.programmes?.find(({ isPrimary }) => isPrimary) ?? profile?.programmes?.[0];
  return {
    name: '',
    description: '',
    universityId: profile?.universityId ?? '',
    faculty: programme?.faculty ?? '',
    subject: '',
    semester: 1,
    difficulty: 3,
    materials: [],
    materialType: 'exam',
  };
}

export function canUploadCourseMaterial(
  profile: Profile | undefined,
  course: Pick<Course, 'universityId' | 'subject' | 'faculty'> | undefined,
): boolean {
  const primary = profile?.programmes?.find(({ isPrimary }) => isPrimary);
  if (!profile || !course || !primary || profile.universityId !== course.universityId) return false;
  return (
    primary.programme.trim().toLocaleLowerCase('pl') ===
      course.subject.trim().toLocaleLowerCase('pl') &&
    primary.faculty.trim().toLocaleLowerCase('pl') === course.faculty.trim().toLocaleLowerCase('pl')
  );
}
