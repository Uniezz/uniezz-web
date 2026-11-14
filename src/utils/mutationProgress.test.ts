import assert from 'node:assert/strict';
import { test } from 'node:test';
import { QueryClient } from '@tanstack/react-query';
import { showMutationProgress, toast } from './mutationProgress';

test('form result toast replaces the progress toast, later toasts are separate', async () => {
  const client = new QueryClient();
  showMutationProgress(client.getMutationCache());
  const run = (progress?: () => string) =>
    client
      .getMutationCache()
      .build(client, { mutationFn: async () => 'ok', meta: { analyticsAction: 'x', progress } })
      .execute(undefined);

  await run(() => 'Saving…');
  assert.equal(toast.success('Saved'), 'mutation-progress');
  assert.notEqual(toast.success('Again'), 'mutation-progress');

  await run();
  assert.notEqual(toast.error('No progress'), 'mutation-progress');
});
