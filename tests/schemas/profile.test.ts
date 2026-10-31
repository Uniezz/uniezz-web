import { expect, test } from 'bun:test';
import { profileSchema, profileFormSchema } from '../../src/schemas';

test('profile names must be nonempty and are normalized', () => {
  expect(profileSchema.parse({ first: ' Jan ', last: ' Kowalski ' })).toEqual({
    first: 'Jan',
    last: 'Kowalski',
  });
  expect(profileSchema.safeParse({ first: '', last: 'Kowalski' }).success).toBe(false);
});

test('the profile form validates all editable fields without dropping programme or privacy values', () => {
  const profile = {
    first: ' Jan ',
    last: ' Kowalski ',
    privacy: { showEmail: false, showFaculty: true, showYear: false },
    photo: '/app/avatar.png',
    programmes: [
      {
        id: 'programme-id',
        programme: 'Informatyka',
        faculty: 'Mathematics, Physics and Computer Science',
        yearOfStudy: 3,
        isPrimary: true,
        status: 'active',
        level: 'first_cycle',
        modeOfStudies: 'full_time',
      },
    ],
  };
  const saved = profileFormSchema.parse(profile);
  expect(saved).toEqual({ ...profile, first: 'Jan', last: 'Kowalski' });
  expect(profileFormSchema.safeParse({ ...profile, first: ' ' }).success).toBe(false);
  expect(
    profileFormSchema.safeParse({
      ...profile,
      programmes: [{ ...profile.programmes[0], faculty: '' }],
    }).success,
  ).toBe(false);
});
