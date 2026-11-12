import type { UseFormReturn } from 'react-hook-form';
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

/** An anonymous discovery card: no name, photos or user id until a match. */
export type DiscoveryCard = components['schemas']['Card'];
export type Discovery = components['schemas']['DiscoverOutputBody'];

export type ConnectionPreferences = components['schemas']['Preferences'];
export type UpdateConnectionPreferencesInput = components['schemas']['SavePreferencesInputBody'];
export type ActOnCandidateInput = components['schemas']['ActOnCandidateInputBody'];

export type BlockStudentButtonProps = { studentId: string; onBlocked?: () => void };
export type MatchActionsProps = { connectionId: string; studentId: string };
export type ConnectionPreferencesProps = { mode: ConnectionFilters['mode']; formId: string; onSaved: () => void };
export type ConnectionPreferencesFormProps = { preferences: ConnectionPreferences; mode: ConnectionFilters['mode']; formId: string; onSaved: () => void };
export type ConnectionFilterPanelProps = { form: UseFormReturn<ConnectionFilters>; onApply: (filters: ConnectionFilters) => void };
