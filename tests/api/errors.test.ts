import { expect, test } from 'bun:test';
import createClient from 'openapi-fetch';
import type { paths } from '../../src/@types/schema';
import { ApiRequestError, apiMiddleware } from '../../src/api/errors';

function client(response: Response | Error) {
  const api = createClient<paths>({
    baseUrl: 'https://uniezz.test/api',
    fetch: async () => {
      if (response instanceof Error) throw response;
      return response;
    },
  });
  api.use(apiMiddleware);
  return api;
}

test('successful JSON stays available to the API function', async () => {
  const { data } = await client(Response.json({ items: [] })).GET('/feed/posts/featured');
  expect(data).toEqual({ items: [] });
});

test('HTTP errors retain status and backend details, including non-JSON failures', async () => {
  for (const response of [
    Response.json({ error: 'duplicate' }, { status: 409 }),
    new Response('Bad gateway', { status: 502 }),
  ]) {
    const error = await client(response)
      .GET('/feed/posts/featured')
      .catch((error) => error);
    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error.status).toBe(response.status);
    expect(error.message).toContain('GET /feed/posts/featured');
    if (response.status === 409) expect(error.cause).toEqual({ error: 'duplicate' });
  }
});

test('required response bodies reject empty, null and unexpected 204 responses', async () => {
  for (const response of [
    new Response(''),
    Response.json(null),
    new Response(null, { status: 204 }),
  ]) {
    await expect(client(response).GET('/feed/posts/featured')).rejects.toThrow(
      'expected response body is missing',
    );
  }
});

test('web login and delete endpoints accept their expected 204 responses', async () => {
  const api = () => client(new Response(null, { status: 204 }));
  const body = { email: 'student@kul.pl', university: 'kul' };
  await api().POST('/auth/otp/request', { body });
  await api().POST('/auth/otp/verify', { body: { ...body, code: '123456' } });
  await api().POST('/auth/exchange', { body: { code: 'code' } });
  for (const path of [
    '/feed/posts/{id}',
    '/feed/comments/{id}',
    '/profile/programmes/{id}',
  ] as const) {
    await api().DELETE(path, { params: { path: { id: 'id' } } });
  }
  await api().DELETE('/profile/avatar');
});

test('only programme deletion tolerates a 404', async () => {
  const api = () => client(Response.json({ error: 'not_found' }, { status: 404 }));
  await api().DELETE('/profile/programmes/{id}', { params: { path: { id: 'id' } } });
  await expect(
    api().DELETE('/feed/posts/{id}', { params: { path: { id: 'id' } } }),
  ).rejects.toBeInstanceOf(ApiRequestError);
});

test('OTP HTTP and network errors keep their user-facing messages', async () => {
  const body = { email: 'student@kul.pl', university: 'kul', code: '123456' };
  await expect(
    client(Response.json({ error: 'invalid_code' }, { status: 401 })).POST('/auth/otp/verify', {
      body,
    }),
  ).rejects.toThrow('Wrong or expired code');
  await expect(client(new Error('offline')).POST('/auth/otp/request', { body })).rejects.toThrow(
    'Couldn’t send the code. Try again.',
  );
  const cause = new Error('offline');
  const error = await client(cause)
    .GET('/feed/posts/featured')
    .catch((error) => error);
  expect(error).toBeInstanceOf(ApiRequestError);
  expect(error.cause).toBe(cause);
  expect(error.status).toBeUndefined();
});

test('unauthorized protected requests redirect and still reject', async () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'window');
  let location: string | undefined;
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      location: {
        replace: (url: string) => {
          location = url;
        },
      },
    },
  });
  try {
    await expect(
      client(Response.json({ error: 'unauthorized' }, { status: 401 })).GET('/profile/me'),
    ).rejects.toBeInstanceOf(ApiRequestError);
    expect(location).toBe('/login');
  } finally {
    if (original) Object.defineProperty(globalThis, 'window', original);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});

test('dating age rejection preserves the code used by the preferences dialog', async () => {
  const api = client(Response.json({ error: 'dating_requires_adult' }, { status: 400 }));
  const error = await api
    .PATCH('/connections/me', { body: { openTo: ['dating'] } })
    .catch((error) => error);
  expect(error).toBeInstanceOf(ApiRequestError);
  expect(error.status).toBe(400);
  expect(error.cause).toEqual({ error: 'dating_requires_adult' });
});
