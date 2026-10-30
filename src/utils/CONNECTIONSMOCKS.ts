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
  universities: ['UMCS', 'KUL', 'Politechnika'],
  years: true,
};

export const CONNECTIONSMOCKS = {
  connections,
  defaultFilters,
  name: 'Zofia',
  distance: '1.2 km away',
  photos: '1 of 4',
  title: 'Zofia, 21',
  meta: 'UMCS, Journalism, 3rd year',
  prompt: 'This semester I want to',
  bio: 'find people to explore Lublin with: coffee, concerts, weekend trips. I also run the student radio podcast.',
  mutual: '3 mutual',
  year: 'Year 1–4',
};
