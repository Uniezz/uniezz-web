import { expect, test } from 'bun:test';
import { optionalSearchStringSchema } from '../../src/schemas/routeSearch';

test('route selections accept only bounded strings', () => {
  expect(optionalSearchStringSchema.parse('Kateryna Melnyk')).toBe('Kateryna Melnyk');
  expect(optionalSearchStringSchema.parse(['Kateryna'])).toBeUndefined();
  expect(optionalSearchStringSchema.parse('a'.repeat(121))).toBeUndefined();
});
