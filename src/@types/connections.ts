import type { components } from './schema';

export type StudyLevel = NonNullable<components['schemas']['Programme']['level']>;

/** Empty lists and a null faculty mean "any". */
export type ConnectionFilters = {
  mode: 'friends' | 'studyBuddy' | 'dating';
  universities: string[];
  faculty: string | null;
  levels: StudyLevel[];
  /** Only students who share at least one of my interests. */
  matchInterests: boolean;
  gender: Gender | null;
};

export type Gender = 'male' | 'female';
