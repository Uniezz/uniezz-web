import { expect, test } from 'bun:test';

import { cn } from '../../src/ui/cn';

test('custom font sizes replace the size without removing the text color', () => {
  for (const size of [
    'page-title',
    'panel-title',
    'card-title',
    'section',
    'body',
    'label',
    'detail',
    'micro',
    'profile-name',
    'countdown',
  ]) {
    expect(cn('bg-white text-sm text-ink', `text-${size}`)).toBe(`bg-white text-ink text-${size}`);
  }
  expect(cn('text-label text-ink', 'text-detail')).toBe('text-ink text-detail');
});
