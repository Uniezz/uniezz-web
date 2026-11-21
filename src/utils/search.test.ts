import assert from 'node:assert/strict';
import { test } from 'node:test';
import { profileSearchQuery } from './search';

test('profile search keeps only words the backend accepts', () => {
  assert.equal(profileSearchQuery('ve'), '');
  assert.equal(profileSearchQuery(' kowal ab  jan '), 'kowal jan');
  assert.equal(profileSearchQuery('łódź'), 'łódź');
  assert.equal(profileSearchQuery('one two three four five six'), 'one two three four five');
});
