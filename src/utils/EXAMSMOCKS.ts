import type { Material } from '@/@types';

const materials: Material[] = [
  {
    subject: 'Mathematical Analysis II',
    university: 'Politechnika',
    type: 'Exam',
    author: 'Marek Zieliński',
    rating: '4.8',
    votes: 212,
    downloads: '1,842',
  },
  {
    subject: 'Data Structures & Algorithms',
    university: 'Politechnika',
    type: 'Exam',
    author: 'Taras Hnatiuk',
    rating: '4.5',
    votes: 177,
    downloads: '801',
  },
  {
    subject: 'Thermodynamics, 2024 and 2025',
    university: 'Politechnika',
    type: 'Exam',
    author: 'Piotr Lewandowski',
    rating: '4.9',
    votes: 143,
    downloads: '702',
  },
  {
    subject: 'Constitutional Law, final',
    university: 'UMCS',
    type: 'Exam',
    author: 'Kateryna Melnyk',
    rating: '4.6',
    votes: 98,
    downloads: '1,204',
  },
  {
    subject: 'Microeconomics colloquium set',
    university: 'WSEI',
    type: 'Colloquium',
    author: 'Julia Wójcik',
    rating: '4.4',
    votes: 66,
    downloads: '987',
  },
  {
    subject: 'Organic Chemistry lab reports',
    university: 'Przyrodniczy',
    type: 'Lab reports',
    author: 'Sofiia Bondarenko',
    rating: '4.9',
    votes: 143,
    downloads: '902',
  },
  {
    subject: 'Introduction to Psychology',
    university: 'KUL',
    type: 'Notes',
    author: 'Olena Kovalenko',
    rating: '4.7',
    votes: 81,
    downloads: '874',
  },
];

const universities = [...new Set(materials.map((material) => material.university))];

// TODO(api): Remove this fixture module when exams consumers use the API.
export const EXAMSMOCKS = {
  materials,
  universities,
  semester: 'Winter 2025/26',
};
