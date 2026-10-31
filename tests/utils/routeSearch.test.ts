import { expect, test } from 'bun:test';
import { optionalSearchString } from '../../src/utils/routeSearch';

test('route selections accept only bounded strings', () => {
  expect(optionalSearchString('Kateryna Melnyk')).toBe('Kateryna Melnyk');
  expect(optionalSearchString(['Kateryna'])).toBeUndefined();
  expect(optionalSearchString('a'.repeat(121))).toBeUndefined();
});
