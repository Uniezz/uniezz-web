import createClient from 'openapi-fetch';
import createQueryClient from 'openapi-react-query';
import type { paths } from '@/@types/schema';
import { env } from '@/schemas/env';

export const api = createClient<paths>({
  baseUrl: import.meta.env.DEV ? '/api' : env.VITE_API_URL,
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
