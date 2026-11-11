import type { StudyFile } from '@/@types';

export const studyFileTypeLabels = {
  exam: 'exams.typeExam',
  colloquium: 'exams.typeColloquium',
  lab: 'exams.typeLab',
  notes: 'exams.typeNotes',
} as const satisfies Record<StudyFile['type'], string>;
