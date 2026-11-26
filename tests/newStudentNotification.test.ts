import { afterEach, expect, test } from 'bun:test';
import { onRequest } from '../functions/api/[[path]]';

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

const env = {
  VITE_API_URL: 'https://backend.example',
  TELEGRAM_BOT_TOKEN: 'bot-token',
  TELEGRAM_CHAT_ID: '-100123',
  TELEGRAM_THREAD_ID: '813',
};

async function telegramCalls(path: string, method: string, status = 204) {
  const calls: string[] = [];
  globalThis.fetch = (async (input: Request | string) => {
    const url = typeof input === 'string' ? input : input.url;
    if (url.startsWith('https://api.telegram.org/')) calls.push(url);
    return new Response(null, { status });
  }) as typeof fetch;
  const pending: Promise<unknown>[] = [];
  await onRequest({
    request: new Request(`https://uniezz.example/api${path}`, {
      method,
      headers: { Origin: 'https://uniezz.example' },
    }),
    env,
    waitUntil: (promise) => pending.push(promise),
  });
  await Promise.all(pending);
  return calls;
}

test('finishing onboarding posts to the Telegram group', async () => {
  expect(await telegramCalls('/profile/onboarding', 'PUT')).toEqual([
    'https://api.telegram.org/botbot-token/sendMessage',
  ]);
});

test('other requests and failed onboarding post nothing', async () => {
  expect(await telegramCalls('/profile/me', 'GET', 200)).toEqual([]);
  expect(await telegramCalls('/profile/onboarding', 'PUT', 500)).toEqual([]);
});
