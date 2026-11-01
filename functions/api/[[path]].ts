import { proxyApi } from '../../server/sessionProxy';

export const onRequest = ({ request, env }: { request: Request; env: { VITE_API_URL: string } }) =>
  proxyApi(request, env.VITE_API_URL);
