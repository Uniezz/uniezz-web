import assert from 'node:assert/strict';
import { test } from 'node:test';
import { defaultConnectionFilters, facultyKey, toDiscoverQuery } from './connections';

test('default filters send only the mode', () => {
  assert.deepEqual(JSON.parse(JSON.stringify(toDiscoverQuery(defaultConnectionFilters))), {
    mode: 'friends',
  });
});

test('study buddy sends faculty name and levels', () => {
  const query = toDiscoverQuery({
    ...defaultConnectionFilters,
    mode: 'studyBuddy',
    universities: ['umcs'],
    faculty: facultyKey('umcs', 'Wydział Prawa'),
    levels: ['first_cycle'],
    matchInterests: true,
    gender: 'female',
  });
  assert.deepEqual(query, {
    mode: 'studyBuddy',
    university: ['umcs'],
    faculty: 'Wydział Prawa',
    level: ['first_cycle'],
    gender: 'female',
    sharedInterests: true,
  });
});

test('other modes ignore faculty and levels', () => {
  const query = toDiscoverQuery({
    ...defaultConnectionFilters,
    mode: 'dating',
    faculty: facultyKey('umcs', 'Wydział Prawa'),
    levels: ['first_cycle'],
  });
  assert.equal(query.faculty, undefined);
  assert.equal(query.level, undefined);
});
