import type { components, operations } from './schema';


export type StudyFile = components['schemas']['CourseFile'];
export type StudyFileQuery = Omit<NonNullable<operations['searchFiles']['parameters']['query']>, 'cursor'>;
export type CourseQuery = Omit<NonNullable<operations['listCourses']['parameters']['query']>, 'cursor'>;
