import type { components, operations } from './schema';


export type StudyFile = components['schemas']['CourseFile'];
export type StudyFileQuery = Omit<NonNullable<operations['searchFiles']['parameters']['query']>, 'cursor'>;
export type CourseQuery = Omit<NonNullable<operations['listCourses']['parameters']['query']>, 'cursor'>;

export type Course = components['schemas']['Course'];
export type CreateCourseInput = components['schemas']['CreateCourseInputBody'];
export type UpdateCourseInput = components['schemas']['UpdateCourseInputBody'];
export type CourseComment = components['schemas']['CourseComment'];
export type AddCourseCommentInput = components['schemas']['AddCourseCommentInputBody'];
export type CourseFile = components['schemas']['CourseFile'];
export type AddCourseFileInput = components['schemas']['AddCourseFileInputBody'];
export type Professor = components['schemas']['Professor'];
