import { expect, test } from 'bun:test';
import { courseFormDefaults } from '../../src/utils/exams';
import { sampleProfile } from '../../src/utils/profileSkeletonData';

const programme = sampleProfile.programmes![0]!;

test('new courses use the primary programme even when it is not first', () => {
  const defaults = courseFormDefaults({
    ...sampleProfile,
    universityId: 'umcs',
    programmes: [
      { ...programme, isPrimary: false, faculty: 'Other faculty', programme: 'Other programme' },
      { ...programme, isPrimary: true, faculty: 'Science', programme: 'Computing', yearOfStudy: 4 },
    ],
  });
  expect(defaults).toEqual({
    name: '',
    description: '',
    universityId: 'umcs',
    faculty: 'Science',
    subject: 'Computing',
    semester: 1,
    difficulty: 3,
  });
});

test('profiles without a primary programme use their first programme', () => {
  expect(
    courseFormDefaults({ ...sampleProfile, programmes: [{ ...programme, isPrimary: false }] }),
  ).toMatchObject({
    faculty: programme.faculty,
    subject: programme.programme,
  });
});

test('missing profile or programmes leave academic fields blank', () => {
  expect(courseFormDefaults(undefined)).toMatchObject({
    universityId: '',
    faculty: '',
    subject: '',
  });
  expect(courseFormDefaults({ ...sampleProfile, programmes: [] })).toMatchObject({
    universityId: sampleProfile.universityId,
    faculty: '',
    subject: '',
  });
});
