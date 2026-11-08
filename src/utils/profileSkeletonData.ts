import type { components } from '@/@types/schema';

export const sampleProfile: components['schemas']['Profile'] = {
  id: 'skeleton',
  firstName: 'Student',
  lastName: 'Name',
  avatarUrl: null,
  gender: null,
  language: 'pl',
  universityId: 'umcs',
  bio: null,
  email: null,
  interests: null,
  createdAt: '2026-01-01T12:00:00Z',
  privacy: { showEmail: false, showFaculty: true, showYear: true },
  programmes: [
    {
      id: 'skeleton',
      faculty: 'Faculty',
      programme: 'Study programme',
      isPrimary: true,
      status: 'active',
      level: null,
      modeOfStudies: null,
      yearOfStudy: 1,
    },
  ],
};

export const samplePublicProfile: components['schemas']['PublicProfile'] = {
  ...sampleProfile,
  bio: 'A short introduction from this student.',
  interests: ['Music', 'Books', 'Travel'],
};
