import { expect, test } from 'bun:test';
import { matchesSearch } from '../../src/utils/search';

test('search ignores surrounding whitespace and case across fixture fields', () => {
  expect(matchesSearch('  UMCS ', 'Kateryna Melnyk', 'UMCS')).toBe(true);
  expect(matchesSearch('absent', 'Kateryna Melnyk')).toBe(false);
  expect(matchesSearch('', 'UMCS')).toBe(true);
});
