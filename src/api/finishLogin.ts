import { captureAnalytics } from '@/utils/analytics';
import type { QueryClient } from '@tanstack/react-query';
import { redirect } from '@tanstack/react-router';
import { api } from './client';

export async function finishLogin(
  search: string,
  queryClient: QueryClient,
): Promise<{ error: string }> {
  const params = new URLSearchParams(search);
  const callbackError = params.get('error');
  if (callbackError) {
    captureAnalytics('sign_in_failed', { method: 'USOS', stage: 'callback' });
    return { error: callbackError };
  }

  const code = params.get('code');
  if (!code) {
    captureAnalytics('sign_in_failed', { method: 'USOS', stage: 'missing_code' });
    return { error: 'The sign-in response did not include a code.' };
  }

  captureAnalytics('login_exchange_attempted');
  try {
    const { response, error } = await api.POST('/auth/exchange', { body: { code } });
    if (!response.ok) {
      captureAnalytics('login_exchange_failed');
      captureAnalytics('sign_in_failed', { method: 'USOS', stage: 'exchange' });
      return { error: error?.error || 'Could not finish sign-in. Please try again.' };
    }
  } catch {
    captureAnalytics('login_exchange_failed');
    captureAnalytics('sign_in_failed', { method: 'USOS', stage: 'network' });
    return { error: 'Could not reach the server. Please try again.' };
  }

  captureAnalytics('login_exchange_succeeded');
  captureAnalytics('sign_in_succeeded', { method: 'USOS' });
  queryClient.clear();
  throw redirect({ to: '/feed', replace: true });
}
