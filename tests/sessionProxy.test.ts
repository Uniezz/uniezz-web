import { afterEach, expect, mock, test } from 'bun:test';
import { proxyApi } from '../server/sessionProxy';

const origin = 'https://uniezz.example';
const token = 'a'.repeat(43);
const cookie = `__Host-uniezz-session=${token}`;
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

function request(path: string, options: RequestInit = {}) {
  return new Request(`${origin}/api${path}`, options);
}

for (const path of ['/auth/exchange', '/auth/otp/verify']) {
  test(`${path} puts the session in an HttpOnly cookie without returning the token`, async () => {
    globalThis.fetch = mock(async () =>
      Response.json({ token, expiresAt: new Date(Date.now() + 86_400_000).toISOString() }),
    ) as typeof fetch;
    const response = await proxyApi(
      request(path, { method: 'POST', headers: { Origin: origin }, body: '{}' }),
      'https://backend.example',
    );
    expect(response.status).toBe(204);
    expect(await response.text()).toBe('');
    expect(response.headers.get('set-cookie')).toContain(
      `${cookie}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=`,
    );
    expect(response.headers.get('cache-control')).toBe('no-store');
  });
}

test('forwards only the cookie token, and renews it after success', async () => {
  let forwarded: Request | undefined;
  globalThis.fetch = mock(async (input: RequestInfo | URL) => {
    forwarded = input as Request;
    return Response.json({ id: 'user' });
  }) as typeof fetch;
  const response = await proxyApi(
    request('/profile/me', { headers: { Cookie: cookie, Authorization: 'Bearer attacker' } }),
    'https://backend.example',
  );
  expect(forwarded?.url).toBe('https://backend.example/profile/me');
  expect(forwarded?.headers.get('authorization')).toBe(`Bearer ${token}`);
  expect(forwarded?.headers.get('cookie')).toBeNull();
  expect(response.headers.get('set-cookie')).toContain('Max-Age=2592000');
});

test('rejects cross-origin and originless state-changing requests before forwarding', async () => {
  const fetchMock = mock(async () => new Response());
  globalThis.fetch = fetchMock as typeof fetch;
  for (const headers of [{ Origin: 'https://evil.example' }, {}]) {
    const response = await proxyApi(
      request('/feed/posts', { method: 'POST', headers, body: '{}' }),
      'https://backend.example',
    );
    expect(response.status).toBe(403);
  }
  expect(fetchMock).not.toHaveBeenCalled();
});

test('clears invalid sessions and logout cookies without renewing on server errors', async () => {
  for (const status of [401, 500]) {
    globalThis.fetch = mock(async () => new Response(null, { status })) as typeof fetch;
    const response = await proxyApi(
      request('/profile/me', { headers: { Cookie: cookie } }),
      'https://backend.example',
    );
    expect(response.headers.get('set-cookie')).toBe(
      status === 401
        ? '__Host-uniezz-session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
        : null,
    );
  }
  const logout = await proxyApi(
    request('/auth/logout', { method: 'POST', headers: { Origin: origin, Cookie: cookie } }),
    'https://backend.example',
  );
  expect(logout.status).toBe(204);
  expect(logout.headers.get('set-cookie')).toContain('Max-Age=0');
});

test('rejects malformed or expired upstream sessions and strips untrusted authorization', async () => {
  globalThis.fetch = mock(async () =>
    Response.json({ token: 'invalid', expiresAt: '2020-01-01' }),
  ) as typeof fetch;
  const response = await proxyApi(
    request('/auth/exchange', { method: 'POST', headers: { Origin: origin }, body: '{}' }),
    'https://backend.example',
  );
  expect(response.status).toBe(502);
  expect(response.headers.get('set-cookie')).toBeNull();
  let forwarded: Request | undefined;
  globalThis.fetch = mock(async (input: RequestInfo | URL) => {
    forwarded = input as Request;
    return new Response(null, { status: 401 });
  }) as typeof fetch;
  await proxyApi(
    request('/profile/me', { headers: { Authorization: `Bearer ${token}` } }),
    'https://backend.example',
  );
  expect(forwarded?.headers.get('authorization')).toBeNull();
});

test('rejects expired sessions and malformed login responses', async () => {
  for (const body of [JSON.stringify({ token, expiresAt: '2020-01-01T00:00:00Z' }), 'not-json']) {
    globalThis.fetch = mock(async () => new Response(body)) as typeof fetch;
    const response = await proxyApi(
      request('/auth/otp/verify', { method: 'POST', headers: { Origin: origin }, body: '{}' }),
      'https://backend.example',
    );
    expect(response.status).toBe(502);
    expect(response.headers.get('set-cookie')).toBeNull();
  }
});

test('never redirects proxy requests to an attacker-controlled host', async () => {
  let forwarded: Request | undefined;
  globalThis.fetch = mock(async (input: RequestInfo | URL) => {
    forwarded = input as Request;
    return new Response();
  }) as typeof fetch;
  await proxyApi(request('//evil.example/path'), 'https://backend.example');
  expect(new URL(forwarded!.url).host).toBe('backend.example');
});
