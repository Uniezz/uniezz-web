// TODO(api): Remove this fixture module when connections consumers use the API.
import type { ConnectionFilters } from '@/@types';

const connections = [
  { id: 'anna-nowak', name: 'Anna Nowak', meta: 'KUL, connected 2h ago', image: 2 },
  { id: 'piotr-lewandowski', name: 'Piotr Lewandowski', meta: 'Przyrodniczy, yesterday', image: 3 },
  { id: 'julia-wojcik', name: 'Julia Wójcik', meta: 'WSEI, Monday', image: 4 },
  { id: 'julia-wojcik-1', name: 'Julia Wójcik1', meta: 'WSEI, Monday', image: 4 },
  { id: 'julia-wojcik-2', name: 'Julia Wójcik2', meta: 'WSEI, Monday', image: 4 },
  { id: 'julia-wojcik-3', name: 'Julia Wójcik3', meta: 'WSEI, Monday', image: 4 },
  { id: 'julia-wojcik-5', name: 'Julia Wójcik5', meta: 'WSEI, Monday', image: 4 },
  { id: 'julia-wojcik-6', name: 'Julia Wójcik6', meta: 'WSEI, Monday', image: 4 },
  { id: 'julia-wojcik-7', name: 'Julia Wójcik7', meta: 'WSEI, Monday', image: 4 },
];

const defaultFilters: ConnectionFilters = {
  mode: 'friends',
  universities: [],
  faculty: null,
  levels: [],
  matchInterests: false,
  gender: null,
};

const candidate = {
  universityId: 'umcs',
  faculty: 'Wydział Politologii i Dziennikarstwa',
  level: 'first_cycle',
  gender: 'female',
  interests: ['Coffee', 'Film', 'Travel', 'Books', 'Radio'],
} as const;

export const CONNECTIONSMOCKS = {
  connections,
  defaultFilters,
  candidate,
  name: 'Zofia',
  photos: ['/app/kuQtw-1.jpg', '/app/kuQtw-2.jpg', '/app/kuQtw-4.jpg', '/app/kuQtw-5.jpg'],
  title: 'Zofia, 21',
  meta: 'UMCS, Journalism, 3rd year',
  prompt: 'I want to…',
  bio: 'find people to explore Lublin with: coffee, concerts, weekend trips. I also run the student radio podcast.',
};
