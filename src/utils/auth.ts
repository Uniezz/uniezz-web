import type { paths } from '@/@types/schema';
import { env } from '@/schemas/env';

type UsosQuery = NonNullable<paths['/auth/usos/start']['get']['parameters']['query']>;

export function startUniversityLogin(
  university: UsosQuery['university'],
  referralCode?: UsosQuery['referralCode'],
) {
  const url = new URL('/auth/usos/start', env.VITE_API_URL);
  url.searchParams.set('university', university);
  url.searchParams.set('platform', 'web');
  if (referralCode) url.searchParams.set('referralCode', referralCode);
  window.location.assign(url.toString());
}
