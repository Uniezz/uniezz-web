import type { paths } from '@/@types/schema';
import { env } from '@/schemas/env';

type UsosQuery = NonNullable<paths['/auth/usos/start']['get']['parameters']['query']>;

export function startUniversityLogin(university: UsosQuery['university'] = 'umcs') {
  const url = new URL('/auth/usos/start', env.VITE_API_URL);
  url.searchParams.set('university', university);
  url.searchParams.set('platform', 'web');
  window.location.assign(url.toString());
}
