import { AuthPage } from '@/components';
import { useUniversities } from '@/hooks';
import { UIButton, UIRow, UIText } from '@/ui/components';
import { startUniversityLogin } from '@/utils';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
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

    if (selectedUniversity.authMethod === 'USOS') {
      startUniversityLogin(selectedUniversity.id);
      return;
    }

    navigate({ to: '/otp', search: { university: selectedUniversity.id } });
  };

  return (
    <AuthPage topText={t('auth.login.title')} bottomText={t('auth.login.subtitle')}>
      <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 p-1.5">
        {isPending ? (
          <UIText color="gray">Loading universities...</UIText>
        ) : isError ? (
          <UIButton bg="secondary" onClick={() => void refetch()}>
            Couldn’t load universities. Try again.
          </UIButton>
        ) : universities.length === 0 ? (
          <UIText color="gray">No universities available.</UIText>
        ) : (
          <div className="flex flex-col gap-1">
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
        )}
      </div>
      <UIButton
        className="w-full"
        bg="gradient"
        leftIcon={ArrowRight}
        onClick={handleContinue}
        disabled={!selectedUniversity || isError}
      >
        <UIText weight="semibold" className="text-ink">
          {selectedUniversity
            ? t('auth.login.continueWith', {
                provider:
                  selectedUniversity.authMethod === 'OTP'
                    ? 'Email code'
                    : selectedUniversity.authMethod,
              })
            : 'Continue'}
        </UIText>
      </UIButton>
    </AuthPage>
  );
}
