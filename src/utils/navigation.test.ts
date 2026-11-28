import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getBottomTabs } from './navigation';

test('getBottomTabs lists the mobile app tabs in order, without chat when it is off', () => {
  assert.deepEqual(
    getBottomTabs(true).map(({ to }) => to),
    ['/feed', '/chat', '/connections', '/exams', '/faq'],
  );
  assert.ok(!getBottomTabs(false).some(({ to }) => to === '/chat'));
});
