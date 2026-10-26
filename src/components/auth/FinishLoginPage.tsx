import { UIButton, UIText } from '@/ui/components';
import { AuthPage } from './AuthPage';

type FinishLoginPageProps = {
  error?: string;
};

export function FinishLoginPage({ error }: FinishLoginPageProps) {
  return (
    <AuthPage
      topText={error ? 'Sign-in failed' : 'Finishing sign-in'}
      bottomText={error || 'Please wait while we finish your USOS sign-in.'}
    >
      {error ? (
        <UIButton navigateTo="/login">
          <UIText className="text-ink">Back to universities</UIText>
        </UIButton>
      ) : null}
    </AuthPage>
  );
}
