import { api } from '@/api/client';
import { AuthPage } from '@/components';
import { UIButton, UIText } from '@/ui/components';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

export const Route = createFileRoute('/(auth)/finish')({
  component: FinishPage,
});

export function FinishPage() {
  const navigate = useNavigate();
  const handled = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const callbackError =
    params.get('error') || (!code ? 'The sign-in response did not include a code.' : null);
  const visibleError = callbackError || error;

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    if (callbackError || !code) return;

    void api
      .POST('/auth/exchange', { body: { code } })
      .then(({ data, error: apiError }) => {
        if (apiError || !data) {
          setError(apiError?.error || 'Could not finish sign-in. Please try again.');
          return;
        }
        sessionStorage.setItem('uniezz:access-token', data.token);
        sessionStorage.setItem('uniezz:session-expires-at', data.expiresAt);
        void navigate({ to: '/feed', replace: true });
      })
      .catch(() => setError('Could not reach the server. Please try again.'));
  }, [navigate, code, callbackError]);

  return (
    <AuthPage
      topText={visibleError ? 'Sign-in failed' : 'Finishing sign-in'}
      bottomText={visibleError || 'Please wait while we finish your USOS sign-in.'}
    >
      {visibleError ? (
        <UIButton onClick={() => void navigate({ to: '/login' })}>
          <UIText>Back to universities</UIText>
        </UIButton>
      ) : null}
    </AuthPage>
  );
}
