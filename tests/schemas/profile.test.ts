import { expect, test } from 'bun:test';
import {
  addProgrammeSchema,
  avatarImageSchema,
  profileSchema,
  profileFormSchema,
} from '../../src/schemas';

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
  expect(
    profileFormSchema.parse({ ...profile, bio: ' Hello ', interests: 'music, , sport ' }),
  ).toEqual({
    ...profile,
    first: 'Jan',
    last: 'Kowalski',
    interests: ['music', 'sport'],
  });
  expect(profileFormSchema.safeParse({ ...profile, bio: 'x'.repeat(501) }).success).toBe(false);
  expect(profileFormSchema.safeParse({ ...profile, interests: 'x'.repeat(31) }).success).toBe(
    false,
  );
  expect(
    profileFormSchema.safeParse({ ...profile, interests: Array(11).fill('x').join(',') }).success,
  ).toBe(false);
});

test('programme names are trimmed and required', () => {
  expect(addProgrammeSchema.parse({ programme: ' Computing ', faculty: ' Science ' })).toEqual({
    programme: 'Computing',
    faculty: 'Science',
  });
  expect(addProgrammeSchema.safeParse({ programme: ' ', faculty: 'Science' }).success).toBe(false);
});

test('avatar images must be nonempty, supported, and at most 5 MB', () => {
  expect(avatarImageSchema.safeParse(new File(['x'], 'a.png', { type: 'image/png' })).success).toBe(
    true,
  );
  expect(avatarImageSchema.safeParse(new File([], 'a.png', { type: 'image/png' })).success).toBe(
    false,
  );
  expect(
    avatarImageSchema.safeParse(new File(['x'], 'a.svg', { type: 'image/svg+xml' })).success,
  ).toBe(false);
  expect(
    avatarImageSchema.safeParse(
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'a.png', { type: 'image/png' }),
    ).success,
  ).toBe(false);
});
