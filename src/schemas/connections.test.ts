import assert from 'node:assert/strict';
import { test } from 'node:test';
import { birthDateSchema } from './connections';

const valid = (birthDate: string) => birthDateSchema.safeParse({ birthDate }).success;
const yearsAgo = (years: number, extraDays = 0) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  date.setDate(date.getDate() + extraDays);
  return date.toISOString().slice(0, 10);
};

test('birth date must be a real date at least 16 years ago', () => {
  assert.equal(valid(yearsAgo(16)), true);
  assert.equal(valid('2000-01-15'), true);
  assert.equal(valid(yearsAgo(16, 1)), false);
  assert.equal(valid(''), false);
  assert.equal(valid('2000-13-40'), false);
});
