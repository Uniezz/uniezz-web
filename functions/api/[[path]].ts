// Same-origin proxy to the backend, which sends no CORS headers yet.
export const onRequest = ({
  request,
  env,
}: {
  request: Request;
  env: { VITE_API_URL: string };
}) => {
  const url = new URL(request.url);
  const target = new URL(url.pathname.replace(/^\/api/, '') + url.search, env.VITE_API_URL);
  return fetch(new Request(target, request));
};
