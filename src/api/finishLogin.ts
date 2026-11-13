import { captureAnalytics } from '@/utils';
import type { QueryClient } from '@tanstack/react-query';
import { redirect } from '@tanstack/react-router';
import { api } from './client';
import { ApiRequestError } from './errors';

export async function finishLogin(
  search: Record<string, unknown>,
  queryClient: QueryClient,
): Promise<{ error: string }> {
  const callbackError = typeof search.error === 'string' ? search.error : undefined;
  if (callbackError) {
    captureAnalytics('sign_in_failed', { method: 'USOS', stage: 'callback' });
    return { error: callbackError };
  }

  const code = typeof search.code === 'string' ? search.code : undefined;
  if (!code) {
    captureAnalytics('sign_in_failed', { method: 'USOS', stage: 'missing_code' });
    return { error: 'The sign-in response did not include a code.' };
  }

  captureAnalytics('login_exchange_attempted');
  try {
    await api.POST('/auth/exchange', { body: { code } });
  } catch (error) {
    const isHttpError = error instanceof ApiRequestError && error.status !== undefined;
    captureAnalytics('login_exchange_failed');
    captureAnalytics('sign_in_failed', {
      method: 'USOS',
      stage: isHttpError ? 'exchange' : 'network',
    });
    return {
      error: isHttpError
        ? 'Could not finish sign-in. Please try again.'
        : 'Could not reach the server. Please try again.',
    };
  }

  captureAnalytics('login_exchange_succeeded');
  captureAnalytics('sign_in_succeeded', { method: 'USOS' });
  queryClient.clear();
  throw redirect({ to: '/feed', replace: true });
}
