import type { components } from '@/@types/schema';

type IssuedSession = components['schemas']['IssuedSession'];

export function saveSession(session: IssuedSession): void {
  sessionStorage.setItem('uniezz:access-token', session.token);
  sessionStorage.setItem('uniezz:session-expires-at', session.expiresAt);
}
