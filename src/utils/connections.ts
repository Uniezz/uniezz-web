import type { ConnectionFilters, StudyLevel } from '@/@types';
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

export const studyLevelLabels = {
  first_cycle: 'app.studyLevelFirstCycle',
  second_cycle: 'app.studyLevelSecondCycle',
  long_cycle: 'app.studyLevelLongCycle',
  third_cycle: 'app.studyLevelThirdCycle',
  phd_school: 'app.studyLevelPhdSchool',
} as const satisfies Record<StudyLevel, string>;

// the phone Meet tabs, as in the app
export const CONNECTION_MODES = [
  ['friends', 'app.friends'],
  ['studyBuddy', 'app.study'],
  ['dating', 'app.dating'],
] as const;

// opened together with the birth date, so the deck has cards; dating needs an adult with a full profile
export const DEFAULT_OPEN_TO = ['friends', 'studyBuddy'] as const;

// the backend allows this many likes per 24 hours
export const DAILY_LIKE_LIMIT = 50;

// candidate action errors by HTTP status, as the app shows them
export const CANDIDATE_ERRORS: Record<number, 'connections.cardExpired' | 'connections.likeLimit'> =
  {
    404: 'connections.cardExpired',
    429: 'connections.likeLimit',
  };

// short university names for the phone Meet card, as in the app; others show their id
export const UNIVERSITY_SHORT_NAMES: Record<string, string> = {
  umcs: 'UMCS',
  umlub: 'UM',
  kul: 'KUL',
  up: 'Przyrodniczy',
  pollub: 'Politechnika Lubelska',
  wspa: 'WSPA',
  wsei: 'WSEI',
};

/** A calendar day ("2004-05-17") in local time, so the day never shifts. */
export const toCalendarDay = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
