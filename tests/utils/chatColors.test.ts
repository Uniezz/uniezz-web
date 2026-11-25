import { expect, test } from 'bun:test';
import { senderColor } from '../../src/utils/chatColors';

test('a member always has the same colour', () => {
  expect(senderColor('a1')).toBe(senderColor('a1'));
});

test('members get all four colours, and never red', () => {
  const colors = new Set(['a', 'b', 'c', 'd', 'e', 'f'].map(senderColor));
  expect([...colors].sort()).toEqual(['text-amber', 'text-green', 'text-pink', 'text-sky']);
});

test('a deleted account has a neutral colour', () => {
  expect(senderColor(null)).toBe('text-secondary');
});
