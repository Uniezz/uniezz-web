import { proxyApi } from '../../server/sessionProxy';

type Env = {
  VITE_API_URL: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  TELEGRAM_THREAD_ID?: string;
};

export const onRequest = async ({
  request,
  env,
  waitUntil,
}: {
  request: Request;
  env: Env;
  waitUntil: (promise: Promise<unknown>) => void;
}) => {
  const response = await proxyApi(request, env.VITE_API_URL);
  // Onboarding finishes once per student, so its success marks a new registration.
  // shortcut: a client retry of PUT /profile/onboarding would post twice; move to the backend if that shows up.
  const isNewStudent =
    response.ok &&
    request.method === 'PUT' &&
    new URL(request.url).pathname === '/api/profile/onboarding';
  if (isNewStudent && env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID && env.TELEGRAM_THREAD_ID) {
    waitUntil(
      fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          message_thread_id: env.TELEGRAM_THREAD_ID,
          text: '🎉 Новый студент зарегистрировался в uniezz',
        }),
      }).catch(() => undefined),
    );
  }
  return response;
};
