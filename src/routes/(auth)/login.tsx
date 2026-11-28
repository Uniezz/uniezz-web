import {
  UNIVERSITY_SHORT_NAMES,
  captureAnalytics,
  getInviteCode,
  startUniversityLogin,
} from '@/utils';
import { AuthPage } from '@/components';
import { useUniversities } from '@/hooks';
import { UIButton, UIRow, UIRowGroup, UIText } from '@/ui/components';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>();
  const { data, isPending, isError, refetch } = useUniversities();
  const universities = data ?? [];
  const selectedUniversity = universities.find(({ id }) => id === selectedId) ?? universities[0];

  const handleContinue = () => {
    if (!selectedUniversity) return;
    const referralCode = getInviteCode();
    captureAnalytics('sign_in_started', {
      method: selectedUniversity.authMethod,
      university: selectedUniversity.id,
    });

    if (selectedUniversity.authMethod === 'USOS') {
      captureAnalytics('sign_in_redirected', { method: 'USOS' });
      startUniversityLogin(selectedUniversity.id, referralCode);
      return;
    }

    navigate({ to: '/otp', search: { university: selectedUniversity.id } });
  };

  const handleRetry = () => void refetch();

  return (
    <AuthPage topText={t('auth.login.title')} bottomText={t('auth.login.subtitle')}>
      {/* the desktop box; on a phone only its content shows */}
      <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 p-1.5 max-lg:contents">
        {isPending ? (
          <UIText color="gray">{t('auth.loadingUniversities')}</UIText>
        ) : isError ? (
          <UIButton bg="secondary" onClick={handleRetry}>
            {t('auth.universitiesLoadError')}
          </UIButton>
        ) : universities.length === 0 ? (
          <UIText color="gray">{t('auth.noUniversities')}</UIText>
        ) : (
          <>
            <div className="flex flex-col gap-1 max-lg:hidden">
              {universities.map(({ id, name }) => (
                <UIRow
                  key={id}
                  onClick={() => setSelectedId(id)}
                  selected={id === selectedUniversity?.id}
                  iconText={id.toUpperCase().slice(0, 3)}
                  iconSrc={`/universities/${id}.png`}
                  topText={id.toUpperCase()}
                  fullName={name}
                />
              ))}
            </div>
            {/* Phone: the mobile app's inset row picker, scrolling on its own above the pinned button. */}
            <div className="-mb-1 scrollbar-hidden max-h-[max(160px,calc(100svh-400px-env(safe-area-inset-top)-env(safe-area-inset-bottom)))] overflow-y-auto overscroll-contain lg:hidden">
              <UIRowGroup label={t('auth.login.title')}>
                {universities.map(({ id, name }) => (
                  <UIRow
                    key={id}
                    appearance="inset"
                    onClick={() => setSelectedId(id)}
                    selected={id === selectedUniversity?.id}
                    iconText={id.toUpperCase().slice(0, 3)}
                    iconSrc={`/universities/${id}.png`}
                    topText={UNIVERSITY_SHORT_NAMES[id] ?? name}
                    fullName={name}
                  />
                ))}
              </UIRowGroup>
            </div>
          </>
        )}
      </div>
      <UIButton
        className="w-full max-lg:min-h-14 max-lg:rounded-[14px] max-lg:motion-safe:animate-rise-in max-lg:motion-safe:[animation-delay:400ms] max-lg:[&>svg:first-child]:hidden"
        bg="gradient"
        leftIcon={ArrowRight}
        onClick={handleContinue}
        disabled={!selectedUniversity || isError}
      >
        <ShieldCheck size={18} aria-hidden className="text-ink lg:hidden" />
        <UIText
          weight="semibold"
          className="text-ink max-lg:min-w-0 max-lg:text-center max-lg:text-section"
        >
          {t('auth.login.continueWith', {
            provider:
              selectedUniversity?.authMethod === 'OTP'
                ? t('auth.emailCode')
                : (selectedUniversity?.authMethod ?? t('auth.university')),
          })}
        </UIText>
      </UIButton>
      {/* the mobile app's note under the button */}
      <UIText size="sm" color="secondary" className="-mt-1.5 pb-2 text-center lg:hidden">
        {t('auth.passwordPrivacy')}
      </UIText>
    </AuthPage>
  );
}
