const SESSION_COOKIE = '__Host-uniezz-session';
// Local dev runs on plain http, where Safari drops Secure and __Host- cookies.
const DEV_SESSION_COOKIE = 'uniezz-session';
const SESSION_SECONDS = 30 * 24 * 60 * 60;
const LOGIN_PATHS = new Set(['/auth/exchange', '/auth/otp/verify']);
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function sessionCookie(token: string, maxAge: number, dev: boolean): string {
  if (dev)
    return `${DEV_SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function sessionToken(request: Request, dev: boolean): string | undefined {
  const name = dev ? DEV_SESSION_COOKIE : SESSION_COOKIE;
  const cookie = request.headers
    .get('cookie')
    ?.split(';')
    .map((part) => part.trim());
  const value = cookie?.find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
  return value && /^[A-Za-z0-9_-]{43}$/.test(value) ? value : undefined;
}

export async function proxyApi(
  request: Request,
  backendUrl: string,
  dev = false,
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.slice('/api'.length);
  const isLogin = LOGIN_PATHS.has(path) && request.method === 'POST';
  const token = sessionToken(request, dev);

  if (!SAFE_METHODS.has(request.method) && request.headers.get('origin') !== url.origin) {
    return new Response('Forbidden', { status: 403, headers: { 'Cache-Control': 'no-store' } });
  }

  // shortcut: logout only clears the cookie; the token stays valid until expiry. Forward it
  // once the backend has a revoke endpoint.
  if (path === '/auth/logout' && request.method === 'POST') {
    return new Response(null, {
      status: 204,
      headers: { 'Set-Cookie': sessionCookie('', 0, dev), 'Cache-Control': 'no-store' },
    });
  }

  const target = new URL(backendUrl);
  target.pathname = path;
  target.search = url.search;
  const headers = new Headers(request.headers);
  headers.delete('cookie');
  headers.delete('authorization');
  headers.delete('host');
  headers.set('accept-encoding', 'identity');
  if (token && !path.startsWith('/auth/')) headers.set('Authorization', `Bearer ${token}`);
  const upstream = await fetch(
    new Request(target, {
      method: request.method,
      headers,
      body: request.body,
      redirect: 'manual',
      ...(request.body ? { duplex: 'half' } : {}),
    } as RequestInit),
  );
  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete('set-cookie');
  responseHeaders.set('Cache-Control', 'no-store');

  if (isLogin && upstream.ok) {
    const data: unknown = await upstream.json().catch(() => null);
    if (
      !data ||
      typeof data !== 'object' ||
      !('token' in data) ||
      typeof data.token !== 'string' ||
      !/^[A-Za-z0-9_-]{43}$/.test(data.token) ||
      !('expiresAt' in data) ||
      typeof data.expiresAt !== 'string'
    ) {
      return new Response('Invalid session response', {
        status: 502,
        headers: { 'Cache-Control': 'no-store' },
      });
    }
    const maxAge = Math.min(
      SESSION_SECONDS,
      Math.floor((Date.parse(data.expiresAt) - Date.now()) / 1000),
    );
    if (!Number.isFinite(maxAge) || maxAge <= 0) {
      return new Response('Invalid session response', {
        status: 502,
        headers: { 'Cache-Control': 'no-store' },
      });
    }
    return new Response(null, {
      status: 204,
      headers: {
        'Set-Cookie': sessionCookie(data.token, maxAge, dev),
        'Cache-Control': 'no-store',
      },
    });
  }

  if (token && !path.startsWith('/auth/')) {
    if (upstream.status === 401) responseHeaders.set('Set-Cookie', sessionCookie('', 0, dev));
    else if (upstream.ok)
      responseHeaders.set('Set-Cookie', sessionCookie(token, SESSION_SECONDS, dev));
  }
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
