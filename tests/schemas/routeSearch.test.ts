import { expect, test } from 'bun:test';
import { returnPathSchema } from '../../src/schemas/routeSearch';

test('returnPathSchema keeps in-app paths and drops other sites', () => {
  expect(returnPathSchema.parse('/profile')).toBe('/profile');
  expect(returnPathSchema.parse('/connections/students/1?studentSearch=a')).toBe(
    '/connections/students/1?studentSearch=a',
  );
  for (const bad of ['//evil.com', '/\\evil.com', 'https://evil.com', 'profile', 42]) {
    expect(returnPathSchema.parse(bad)).toBeUndefined();
  }
});
