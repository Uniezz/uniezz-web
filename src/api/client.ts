import createClient from 'openapi-fetch';
import createQueryClient from 'openapi-react-query';
import type { paths } from '@/@types/schema';

export const api = createClient<paths>({
  baseUrl: '/api',
});

api.use({
  onResponse({ response, schemaPath }) {
    if (response.status === 401 && !schemaPath.startsWith('/auth/')) {
      window.location.assign('/login');
    }
    return response;
  },
});

export const $api = createQueryClient(api);
