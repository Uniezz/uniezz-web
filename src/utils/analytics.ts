import posthog, { type PostHog, type PostHogConfig } from 'posthog-js';
import { MutationCache } from '@tanstack/react-query';

export function captureAnalytics(
  event: string,
  properties?: Record<string, string | number>,
): void {
  try {
    posthog.capture(event, properties);
  } catch {
    // Analytics must never interrupt navigation or a user's action.
  }
}

export function analyticsPath(path: string): string {
  return path
    .replace(/^(\/feed\/post\/)(?!new-post(?:\/|$))[^/]+/, '$1:postId')
    .replace(/^(\/connections\/students\/)[^/]+/, '$1:profileId')
    .replace(/^(\/exams\/courses\/)(?!new(?:\/|$))[^/]+/, '$1:courseId');
}

function safeUrl(value: string): string {
  if (!value || value === '$direct') return value;
  try {
    const url = new URL(value, 'https://analytics.invalid');
    const path = analyticsPath(url.pathname);
    return value.startsWith('/') ? path : `${url.origin}${path}`;
  } catch {
    return '';
  }
}

export const sanitizeAnalyticsEvent: NonNullable<PostHogConfig['before_send']> = (event) => {
  if (!event) return null;
  // SDK attribution properties may also contain the original callback URL.
  for (const properties of [event.properties, event.properties.$set, event.properties.$set_once]) {
    if (!properties || typeof properties !== 'object') continue;
    for (const key of Object.keys(properties)) {
      if (/(?:url|pathname|referrer)$/.test(key) && typeof properties[key] === 'string') {
        properties[key] = safeUrl(properties[key]);
      }
    }
  }
  return event;
};

export function createAnalyticsMutationCache(client: Pick<PostHog, 'capture'>): MutationCache {
  const capture = (action: string, outcome: string) => {
    try {
      client.capture(`${action}_${outcome}`);
    } catch {
      // Telemetry failures must not turn successful writes into failed writes.
    }
  };
  return new MutationCache({
    onMutate: (_, mutation) => capture(mutation.meta?.analyticsAction ?? 'mutation', 'attempted'),
    onSuccess: (data, _, __, mutation) => {
      const action = mutation.meta?.analyticsAction ?? 'mutation';
      // Upload batches retain partial results for retry instead of rejecting.
      const failed =
        action === 'images_upload_batch' &&
        data &&
        typeof data === 'object' &&
        'failed' in data &&
        data.failed === true;
      capture(action, failed ? 'failed' : 'succeeded');
    },
    onError: (_, __, ___, mutation) =>
      capture(mutation.meta?.analyticsAction ?? 'mutation', 'failed'),
  });
}

export function trackLocalAction<T>(action: string, run: () => T): T {
  captureAnalytics(`${action}_attempted`, { storage: 'local' });
  try {
    const result = run();
    captureAnalytics(`${action}_succeeded`, { storage: 'local' });
    return result;
  } catch (error) {
    captureAnalytics(`${action}_failed`, { storage: 'local' });
    throw error;
  }
}
