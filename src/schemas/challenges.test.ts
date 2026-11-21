import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  challengeBody,
  challengeFormValues,
  challengeSchema,
  challengeUpdateBody,
} from './challenges';

const base = {
  action: 'like_given',
  period: 'day',
  target: '5',
  reward: '20',
  startsAt: '',
  endsAt: '',
  titlePl: 'Polub 5 postów',
  descriptionPl: '',
  titleEn: '',
  descriptionEn: '',
};

test('challenge form validates ranges and dates', () => {
  assert.equal(challengeSchema.safeParse(base).success, true);
  assert.equal(challengeSchema.safeParse({ ...base, target: '0' }).success, false);
  assert.equal(challengeSchema.safeParse({ ...base, reward: '1001' }).success, false);
  assert.equal(challengeSchema.safeParse({ ...base, titlePl: ' ' }).success, false);
  assert.equal(
    challengeSchema.safeParse({ ...base, startsAt: '2026-12-02T10:00', endsAt: '2026-12-01T10:00' })
      .success,
    false,
  );
});

test('challenge body leaves out empty optional fields', () => {
  const body = challengeBody(challengeSchema.parse(base));
  assert.deepEqual(body, {
    action: 'like_given',
    period: 'day',
    target: 5,
    reward: 20,
    texts: { pl: { title: 'Polub 5 postów' } },
  });
  const full = challengeBody(
    challengeSchema.parse({ ...base, startsAt: '2026-12-01T10:00', titleEn: 'Like 5 posts' }),
  );
  assert.equal(typeof full.startsAt, 'string');
  assert.deepEqual(full.texts.en, { title: 'Like 5 posts' });
});

test('editing keeps other languages and drops a cleared English text', () => {
  const current = {
    id: 'c1',
    action: 'like_given',
    period: 'week' as const,
    target: 5,
    reward: 20,
    startsAt: '2026-12-01T09:00:00Z',
    endsAt: null,
    archivedAt: null,
    createdAt: '2026-11-20T09:00:00Z',
    texts: { pl: { title: 'Stary' }, en: { title: 'Old' }, de: { title: 'Alt' } },
  };
  const values = challengeSchema.parse({
    ...challengeFormValues(current),
    titlePl: 'Nowy',
    titleEn: '',
    reward: '30',
  });
  const body = challengeUpdateBody(values, current);
  assert.equal(body.reward, 30);
  assert.equal(body.startsAt, '2026-12-01T09:00:00.000Z');
  assert.deepEqual(body.texts, { de: { title: 'Alt' }, pl: { title: 'Nowy' } });
});
