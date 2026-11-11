import type { ConnectionFilters } from '@/@types';
import type { operations } from '@/@types/schema';

export const defaultConnectionFilters: ConnectionFilters = {
  mode: 'friends',
  universities: [],
  faculty: null,
  levels: [],
  matchInterests: false,
  gender: null,
};

/** "uni:Faculty name" keeps faculties with the same name at different universities apart. */
export const facultyKey = (universityId: string, faculty: string) => `${universityId}:${faculty}`;

/** Empty filters are left out; faculty and level only narrow the study-buddy search. */
export function toDiscoverQuery({
  mode,
  universities,
  faculty,
  levels,
  matchInterests,
  gender,
}: ConnectionFilters): operations['discoverConnections']['parameters']['query'] {
  const studyBuddy = mode === 'studyBuddy';
  return {
    mode,
    university: universities.length > 0 ? universities : undefined,
    faculty: studyBuddy && faculty ? faculty.slice(faculty.indexOf(':') + 1) : undefined,
    level: studyBuddy && levels.length > 0 ? levels : undefined,
    gender: gender ?? undefined,
    sharedInterests: matchInterests || undefined,
  };
}
