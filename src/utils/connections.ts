import type { ConnectionFilters, StudyLevel } from '@/@types';

export type DiscoveryCandidate = {
  universityId: string;
  faculty: string;
  level: StudyLevel;
};

/** "uni:Faculty name" keeps faculties with the same name at different universities apart. */
export const facultyKey = (universityId: string, faculty: string) => `${universityId}:${faculty}`;

export function matchesConnectionFilters(
  filters: ConnectionFilters,
  candidate: DiscoveryCandidate,
) {
  const { universities, faculty, levels, mode } = filters;
  return (
    (universities.length === 0 || universities.includes(candidate.universityId)) &&
    // Field and level only narrow the study-buddy search.
    (mode !== 'studyBuddy' ||
      ((faculty === null || faculty === facultyKey(candidate.universityId, candidate.faculty)) &&
        (levels.length === 0 || levels.includes(candidate.level))))
  );
}
