import { describe, expect, test } from 'bun:test';
import { QueryClient } from '@tanstack/react-query';
import {
  analyticsPath,
  createAnalyticsMutationCache,
  sanitizeAnalyticsEvent,
} from '../../src/utils/analytics';

describe('analytics privacy', () => {
  test('removes callback credentials, search text, hashes and resource IDs, including attribution', () => {
    const result = sanitizeAnalyticsEvent({
      event: '$pageview',
      uuid: 'test',
      timestamp: new Date().toISOString(),
      properties: {
        $current_url: 'https://uniezz.pl/finish?code=secret#token',
        $pathname: '/feed/post/private-id',
        $prev_pageview_pathname: '/',
        $referrer: '$direct',
        $prev_pageview_max_scroll_percentage: 0.75,
        $set_once: { $initial_current_url: 'https://uniezz.pl/otp?email=private@example.com' },
        $set: { $referrer: 'https://provider.example/callback?code=secret' },
      },
    });
    expect(result?.properties).toEqual({
      $current_url: 'https://uniezz.pl/finish',
      $pathname: '/feed/post/:postId',
      $prev_pageview_pathname: '/',
      $referrer: '$direct',
      $prev_pageview_max_scroll_percentage: 0.75,
      $set_once: { $initial_current_url: 'https://uniezz.pl/otp' },
      $set: { $referrer: 'https://provider.example/callback' },
    });
  });

  test('preserves static routes and groups dynamic profiles', () => {
    expect(analyticsPath('/feed/post/new-post')).toBe('/feed/post/new-post');
    expect(analyticsPath('/connections/students')).toBe('/connections/students');
    expect(analyticsPath('/connections/students/123')).toBe('/connections/students/:profileId');
    expect(analyticsPath('/login')).toBe('/login');
    expect(analyticsPath('/exams/courses/new')).toBe('/exams/courses/new');
    expect(analyticsPath('/exams/courses/course-id/edit')).toBe('/exams/courses/:courseId/edit');
    expect(analyticsPath('/feed/post/post-id/edit')).toBe('/feed/post/:postId/edit');
    expect(sanitizeAnalyticsEvent(null)).toBeNull();
  });
});

test('mutation attempts and outcomes contain no input, result, or error payloads', async () => {
  const events: unknown[][] = [];
  const cache = createAnalyticsMutationCache({
    capture: (...args) => {
      events.push(args);
      return undefined;
    },
  });
  const client = new QueryClient({ mutationCache: cache });
  const success = cache.build(client, {
    meta: { analyticsAction: 'otp_verify' },
    mutationFn: async (input: { code: string }) => {
      expect(input.code).toBe('123456');
      return { token: 'private token' };
    },
  });
  await success.execute({ code: '123456' });
  const failure = cache.build(client, {
    meta: { analyticsAction: 'post_create' },
    mutationFn: async () => {
      throw new Error('private backend response');
    },
  });
  await expect(failure.execute(undefined)).rejects.toThrow();
  expect(events).toEqual([
    ['otp_verify_attempted'],
    ['otp_verify_succeeded'],
    ['post_create_attempted'],
    ['post_create_failed'],
  ]);
  client.clear();
});

test('partial upload failures are failures, while keeping uploaded results for retry', async () => {
  const events: string[] = [];
  const cache = createAnalyticsMutationCache({
    capture: (name) => {
      events.push(name);
      return undefined;
    },
  });
  const client = new QueryClient({ mutationCache: cache });
  const result = { failed: true, uploaded: ['saved-file'], error: new Error('private') };
  const mutation = cache.build(client, {
    meta: { analyticsAction: 'images_upload_batch' },
    mutationFn: async () => result,
  });
  expect(await mutation.execute(undefined)).toBe(result);
  expect(events).toEqual(['images_upload_batch_attempted', 'images_upload_batch_failed']);
  client.clear();
});

test('analytics errors never change the action result', async () => {
  const cache = createAnalyticsMutationCache({
    capture: () => {
      throw new Error('telemetry unavailable');
    },
  });
  const client = new QueryClient({ mutationCache: cache });
  const success = cache.build(client, { mutationFn: async () => 'saved' });
  expect(await success.execute(undefined)).toBe('saved');
  const original = new Error('original');
  const failure = cache.build(client, {
    mutationFn: async () => {
      throw original;
    },
  });
  await expect(failure.execute(undefined)).rejects.toBe(original);
  client.clear();
});
