import assert from 'node:assert/strict';
import { test } from 'node:test';
import { challengeActionLabel, challengeText, coinGrantReasonLabel, questLabel } from './rewards';

test('known codes map to their labels, unknown ones to a generic label', () => {
  assert.equal(coinGrantReasonLabel('like_given'), 'rewards.reasonLikeGiven');
  assert.equal(coinGrantReasonLabel('challenge'), 'rewards.reasonChallenge');
  assert.equal(coinGrantReasonLabel('toString'), 'rewards.reasonOther');
  assert.equal(coinGrantReasonLabel('new_reason'), 'rewards.reasonOther');
  assert.equal(questLabel('reply'), 'rewards.questReply');
  assert.equal(questLabel('streak'), 'rewards.questOther');
});

test('challenge text falls back to Polish', () => {
  const texts = { pl: { title: 'Polub 5 postów' }, en: { title: 'Like 5 posts' } };
  assert.equal(challengeText(texts, 'en').title, 'Like 5 posts');
  assert.equal(challengeText(texts, 'de').title, 'Polub 5 postów');
  assert.equal(challengeText(texts, undefined).title, 'Polub 5 postów');
});

test('challenge actions map to labels, unknown ones to a generic label', () => {
  assert.equal(challengeActionLabel('post_created'), 'rewards.challengeActionPostCreated');
  assert.equal(challengeActionLabel('constructor'), 'rewards.challengeActionOther');
});
