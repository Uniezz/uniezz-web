import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isAdmin, isStaff } from './roles';

test('staff covers moderators and admins; admin only admins', () => {
  assert.equal(isStaff(undefined), false);
  assert.equal(isStaff({ roles: null }), false);
  assert.equal(isStaff({ roles: ['moderator'] }), true);
  assert.equal(isStaff({ roles: ['admin'] }), true);
  assert.equal(isAdmin({ roles: ['moderator'] }), false);
  assert.equal(isAdmin({ roles: ['admin'] }), true);
});
