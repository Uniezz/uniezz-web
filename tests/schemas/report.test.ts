import { expect, test } from 'bun:test';
import { reportSchema } from '../../src/schemas';

test('report requires a supported reason and limits details to 1000 characters', () => {
  expect(reportSchema.safeParse({ reason: '', details: '' }).success).toBe(false);
  expect(reportSchema.safeParse({ reason: 'spam', details: '  details  ' }).data).toEqual({
    reason: 'spam',
    details: 'details',
  });
  expect(reportSchema.safeParse({ reason: 'other', details: 'a'.repeat(1001) }).success).toBe(
    false,
  );
});
