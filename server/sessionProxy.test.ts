import assert from 'node:assert/strict';
import { test } from 'node:test';
import { proxyApi } from './sessionProxy';

const TOKEN = 'a'.repeat(43);

async function forwardedAuthorization(path: string): Promise<string | null> {
  let authorization: string | null = null;
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (input: Request) => {
    authorization = input.headers.get('authorization');
    return new Response('{}', { status: 200 });
  }) as typeof fetch;
  try {
    await proxyApi(
      new Request(`http://localhost/api${path}`, {
        headers: { cookie: `uniezz-session=${TOKEN}` },
      }),
      'https://backend.test',
      true,
    );
  } finally {
    globalThis.fetch = realFetch;
  }
  return authorization;
}

test('the session goes to app and invite endpoints, not to sign-in endpoints', async () => {
  assert.equal(await forwardedAuthorization('/profile/me'), `Bearer ${TOKEN}`);
  assert.equal(await forwardedAuthorization('/auth/invites/me'), `Bearer ${TOKEN}`);
  assert.equal(await forwardedAuthorization('/auth/otp/request'), null);
});
