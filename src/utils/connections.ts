import type { ConnectionFilters, Gender, StudyLevel } from '@/@types';

export type DiscoveryCandidate = {
  universityId: string;
  faculty: string;
  level: StudyLevel;
  gender: Gender;
  interests: readonly string[];
};

/** "uni:Faculty name" keeps faculties with the same name at different universities apart. */
export const facultyKey = (universityId: string, faculty: string) => `${universityId}:${faculty}`;

export function matchesConnectionFilters(
  filters: ConnectionFilters,
  candidate: DiscoveryCandidate,
  myInterests: readonly string[] = [],
) {
  const { universities, faculty, levels, mode, matchInterests, gender } = filters;
  const mine = new Set(myInterests.map((interest) => interest.toLowerCase()));
  return (
    (universities.length === 0 || universities.includes(candidate.universityId)) &&
    (gender === null || gender === candidate.gender) &&
    (!matchInterests || candidate.interests.some((interest) => mine.has(interest.toLowerCase()))) &&
    // Field and level only narrow the study-buddy search.
    (mode !== 'studyBuddy' ||
      ((faculty === null || faculty === facultyKey(candidate.universityId, candidate.faculty)) &&
        (levels.length === 0 || levels.includes(candidate.level))))
  );
}
