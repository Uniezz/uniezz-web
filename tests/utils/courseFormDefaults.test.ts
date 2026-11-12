import { expect, test } from 'bun:test';
import { canUploadCourseMaterial, courseFormDefaults } from '../../src/utils/exams';
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

test('material uploads require the same university and primary programme including faculty', () => {
  const profile = {
    ...sampleProfile,
    programmes: [{ ...programme, isPrimary: true, faculty: 'Science', programme: 'Computing' }],
  };
  const course = {
    id: 'course',
    name: 'Algorithms',
    description: '',
    universityId: sampleProfile.universityId,
    faculty: ' science ',
    subject: ' computing ',
    semester: 1,
    difficulty: 3,
    ratingAverage: 0,
    ratingCount: 0,
    isMine: false,
  };
  expect(canUploadCourseMaterial(profile, course)).toBe(true);
  expect(canUploadCourseMaterial(undefined, course)).toBe(false);
  expect(canUploadCourseMaterial(profile, undefined)).toBe(false);
  expect(canUploadCourseMaterial(profile, { ...course, universityId: 'other' })).toBe(false);
  expect(canUploadCourseMaterial(profile, { ...course, subject: 'Biology' })).toBe(false);
  expect(canUploadCourseMaterial(profile, { ...course, faculty: 'Arts' })).toBe(false);
  expect(
    canUploadCourseMaterial(
      { ...profile, programmes: [{ ...profile.programmes[0], isPrimary: false }] },
      course,
    ),
  ).toBe(false);
});
