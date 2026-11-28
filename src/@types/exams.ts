import type { z } from 'zod';
import type { uploadSchema, examsSearchSchema, createCourseFormSchema, editCourseSchema, courseCommentSchema } from '@/schemas';
import type { components, operations } from './schema';


export type StudyFile = components['schemas']['CourseFile'];
export type StudyFileQuery = Omit<NonNullable<operations['searchFiles']['parameters']['query']>, 'cursor'>;
export type CourseQuery = Omit<NonNullable<operations['listCourses']['parameters']['query']>, 'cursor'>;
export type ProfessorQuery = Omit<NonNullable<operations['listProfessors']['parameters']['query']>, 'cursor' | 'limit'>;

export type Course = components['schemas']['Course'];
export type CreateCourseInput = components['schemas']['CreateCourseInputBody'];
export type UpdateCourseInput = components['schemas']['UpdateCourseInputBody'];
export type CourseComment = components['schemas']['CourseComment'];
export type AddCourseCommentInput = components['schemas']['AddCourseCommentInputBody'];
export type CourseFile = components['schemas']['CourseFile'];
export type AddCourseFileInput = components['schemas']['AddCourseFileInputBody'];
export type Professor = components['schemas']['Professor'];

export type ProfessorReviewsDialogProps = { professorId: string; onClose: () => void };
export type CourseDetailsDialogProps = { courseId: string; onClose: () => void };
export type CourseFormDialogProps = {
  course?: Course;
  onClose: (ignoreBlocker?: boolean) => void;
  /** After the course is deleted from the phone edit sheet; defaults to `onClose`. */
  onDeleted?: (ignoreBlocker?: boolean) => void;
};
export type CourseMaterialsProps = { courseId: string };
export type UploadMaterialProps = { courseId: string; onClose: (ignoreBlocker?: boolean) => void };
export type UploadMaterialButtonProps = { courseId: string };
export type PreviewStudyFileButtonProps = {
  file: StudyFile;
  /** Covers its card, so tapping the card previews the file, as in the mobile app. */
  stretched?: boolean;
};

export type UploadSchema = z.infer<typeof uploadSchema>;
export type ExamsSearch = z.infer<typeof examsSearchSchema>;
export type CreateCourseForm = z.infer<typeof createCourseFormSchema>;
export type EditCourseForm = z.infer<typeof editCourseSchema>;
export type CourseCommentForm = z.infer<typeof courseCommentSchema>;
