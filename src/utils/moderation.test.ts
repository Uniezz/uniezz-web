import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  isRemovableTarget,
  moderationActionLabel,
  reportReasonLabel,
  reportTargetLabel,
  snapshotPreview,
} from './moderation';

test('report labels map known codes and fall back for unknown targets', () => {
  assert.equal(reportReasonLabel('hate_speech'), 'report.hateSpeech');
  assert.equal(reportTargetLabel('file'), 'moderation.targetFile');
  assert.equal(reportTargetLabel('toString'), 'moderation.targetOther');
  assert.equal(reportTargetLabel('event'), 'moderation.targetOther');
  assert.equal(moderationActionLabel('ban'), 'moderation.actionBan');
  assert.equal(moderationActionLabel('mute'), 'moderation.actionOther');
  assert.equal(isRemovableTarget('course'), true);
  assert.equal(isRemovableTarget('professor_review'), true);
  assert.equal(isRemovableTarget('user'), false);
});

test('snapshot preview shows the content and leaves out ids', () => {
  assert.deepEqual(snapshotPreview({ title: 'Hi', content: 'reported text', postId: 'p1' }), {
    heading: 'Hi',
    body: 'reported text',
    tags: [],
  });
  assert.deepEqual(
    snapshotPreview({
      firstName: 'Ewa',
      lastName: ' ',
      bio: 'bio',
      universityId: 'umcs',
      interests: ['Music', ' ', 3],
    }),
    { heading: 'Ewa', body: 'bio', tags: ['Music'] },
  );
  assert.deepEqual(snapshotPreview({}), { heading: undefined, body: undefined, tags: [] });
});
