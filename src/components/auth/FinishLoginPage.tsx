import { LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UIButton, UIText } from '@/ui/components';
import { AuthPage } from './AuthPage';

type FinishLoginPageProps = {
  error?: string;
};

export function FinishLoginPage({ error }: FinishLoginPageProps) {
  const { t } = useTranslation();
  return (
    <>
      {!error && (
        // on a phone, the mobile app's finish screen: only a spinner on ink
        <div
          role="status"
          aria-label={t('apiState.loading')}
          className="fixed inset-0 z-20 grid place-items-center bg-ink lg:hidden"
        >
          <LoaderCircle size={24} aria-hidden className="text-white motion-safe:animate-spin" />
        </div>
      )}
      <AuthPage
        topText={error ? t('auth.signInError') : 'Finishing sign-in'}
        bottomText={error || 'Please wait while we finish your USOS sign-in.'}
      >
        {error ? (
          <UIButton
            navigateTo="/login"
            aria-label={t('auth.backToUniversities')}
            className="max-lg:min-h-14 max-lg:rounded-[14px]"
          >
            <UIText className="text-ink max-lg:text-section max-lg:font-semibold">
              {t('auth.backToUniversities')}
            </UIText>
          </UIButton>
        ) : null}
      </AuthPage>
    </>
  );
}
