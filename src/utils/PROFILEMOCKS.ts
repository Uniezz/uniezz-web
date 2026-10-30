import type { Programme } from '@/@types';

const initialProgrammes: Programme[] = [
  {
    name: 'Informatyka',
    faculty: 'Mathematics, Physics and Computer Science',
    year: '3',
    primary: true,
  },
  {
    name: 'Matematyka',
    faculty: 'Mathematics, Physics and Computer Science',
    year: '2',
    primary: false,
  },
];

export const PROFILEMOCKS = {
  initialProgrammes,
  university: 'Maria Curie-Skłodowska University',
  faculty: 'Mathematics, Physics and Computer Science',
};
