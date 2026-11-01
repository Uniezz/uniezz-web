import { expect, test } from 'bun:test';
import { profileSchema, profileFormSchema } from '../../src/schemas';

test('profile names must be nonempty and are normalized', () => {
  expect(profileSchema.parse({ first: ' Jan ', last: ' Kowalski ' })).toEqual({
    first: 'Jan',
    last: 'Kowalski',
  });
  expect(profileSchema.safeParse({ first: '', last: 'Kowalski' }).success).toBe(false);
});

test('the profile form validates bio, interests and privacy', () => {
  const profile = {
    first: ' Jan ',
    last: ' Kowalski ',
    bio: 'Hello',
    interests: 'music, sport',
    privacy: { showEmail: false, showFaculty: true, showYear: false },
    photo: '/app/avatar.png',
  };
  expect(profileFormSchema.parse(profile)).toEqual({ ...profile, first: 'Jan', last: 'Kowalski' });
  expect(profileFormSchema.safeParse({ ...profile, bio: 'x'.repeat(501) }).success).toBe(false);
  expect(profileFormSchema.safeParse({ ...profile, interests: 'x'.repeat(31) }).success).toBe(
    false,
  );
  expect(
    profileFormSchema.safeParse({ ...profile, interests: Array(11).fill('x').join(',') }).success,
  ).toBe(false);
});
