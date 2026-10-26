import createClient from 'openapi-fetch';
import createQueryClient from 'openapi-react-query';
import type { paths } from '@/@types/schema';

export const api = createClient<paths>({
  // Same-origin in dev (Vite proxy) and prod (Netlify proxy in public/_redirects), so no CORS needed.
  baseUrl: '/api',
});

api.use({
  onRequest({ request, schemaPath }) {
    const token = sessionStorage.getItem('uniezz:access-token');
    if (token && !schemaPath.startsWith('/auth/')) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
});

export const $api = createQueryClient(api);
