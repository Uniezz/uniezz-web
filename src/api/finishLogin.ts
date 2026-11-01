import type { QueryClient } from '@tanstack/react-query';
import { redirect } from '@tanstack/react-router';
import { api } from './client';

export async function finishLogin(
  search: string,
  queryClient: QueryClient,
): Promise<{ error: string }> {
  const params = new URLSearchParams(search);
  const callbackError = params.get('error');
  if (callbackError) return { error: callbackError };

  const code = params.get('code');
  if (!code) return { error: 'The sign-in response did not include a code.' };

  try {
    const { response, error } = await api.POST('/auth/exchange', { body: { code } });
    if (!response.ok) {
      return { error: error?.error || 'Could not finish sign-in. Please try again.' };
    }
  } catch {
    return { error: 'Could not reach the server. Please try again.' };
  }

  queryClient.clear();
  throw redirect({ to: '/feed', replace: true });
}
