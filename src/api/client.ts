import createClient from 'openapi-fetch';
import createQueryClient from 'openapi-react-query';
import type { paths } from '@/@types/schema';
import { apiMiddleware } from './errors';

export const api = createClient<paths>({
  baseUrl: '/api',
});

api.use(apiMiddleware);

export const $api = createQueryClient(api);
