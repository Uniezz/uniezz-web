import { useNavigate } from '@tanstack/react-router';
import { UIButton, UIText } from '@/ui/components';
import { AuthPage } from './AuthPage';

type FinishLoginPageProps = {
  error?: string;
};

export function FinishLoginPage({ error }: FinishLoginPageProps) {
  const navigate = useNavigate();

  return (
    <AuthPage
      topText={error ? 'Sign-in failed' : 'Finishing sign-in'}
      bottomText={error || 'Please wait while we finish your USOS sign-in.'}
    >
      {error ? (
        <UIButton onClick={() => void navigate({ to: '/login' })}>
          <UIText>Back to universities</UIText>
        </UIButton>
      ) : null}
    </AuthPage>
  );
}
