import type { components } from './schema';

export type StudyLevel = NonNullable<components['schemas']['Programme']['level']>;

/** Empty lists and a null faculty mean "any". */
export type ConnectionFilters = {
  mode: 'friends' | 'studyBuddy' | 'dating';
  universities: string[];
  faculty: string | null;
  levels: StudyLevel[];
};
