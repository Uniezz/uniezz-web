import { expect, test } from 'bun:test';
import { datePresetFrom } from '../../src/utils/feed';

test('date presets are rolling windows ending now', () => {
  const now = new Date('2026-04-01T15:30:00Z');
  expect(datePresetFrom('today', now)).toBe('2026-03-31T15:30:00.000Z');
  expect(datePresetFrom('week', now)).toBe('2026-03-25T15:30:00.000Z');
  expect(datePresetFrom('month', now)).toBe('2026-03-02T15:30:00.000Z');
  expect(datePresetFrom('year', now)).toBe('2025-04-01T15:30:00.000Z');
});
