import { expect, test } from 'bun:test';
import { isAuthorProfilePath } from '../../src/utils/feed';

test('isAuthorProfilePath matches only the author’s own profile page', () => {
  expect(isAuthorProfilePath('/connections/students/a?studentSearch=x', 'a')).toBe(true);
  expect(isAuthorProfilePath('/connections/students/b', 'a')).toBe(false);
  expect(isAuthorProfilePath('/profile', 'me', 'me')).toBe(true);
  expect(isAuthorProfilePath('/profile', 'other', 'me')).toBe(false);
  expect(isAuthorProfilePath('/feed', 'a', 'a')).toBe(false);
  expect(isAuthorProfilePath(undefined, 'a')).toBe(false);
});
