import { redirect } from '@tanstack/react-router';
import type { components } from '@/@types/schema';
import { api } from './client';
import { saveSession } from '@/utils/session';

export async function finishLogin(search: string): Promise<{ error: string }> {
  const params = new URLSearchParams(search);
  const callbackError = params.get('error');
  if (callbackError) return { error: callbackError };

  const code = params.get('code');
  if (!code) return { error: 'The sign-in response did not include a code.' };

  let session: components['schemas']['IssuedSession'];
  try {
    const { data, error } = await api.POST('/auth/exchange', { body: { code } });
    if (error || !data) {
      return { error: error?.error || 'Could not finish sign-in. Please try again.' };
    }
    session = data;
  } catch {
    return { error: 'Could not reach the server. Please try again.' };
  }

  try {
    saveSession(session);
  } catch {
    return { error: 'Could not save your session. Please try again.' };
  }

  throw redirect({ to: '/feed', replace: true });
}
