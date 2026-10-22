import { AuthPage } from '@/components';
import { useUniversities } from '@/hooks';
import { UIButton, UIRow, UIText } from '@/ui/components';
import { startUniversityLogin } from '@/utils';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
});

function LoginPage() {
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

    navigate({ to: '/otp' });
  };

  return (
    <AuthPage
      topText="Sign in to Uniezz"
      bottomText="Choose your university to sign in with USOS or a university email code."
    >
      <div className="flex flex-col gap-2.5">
        <UIText color="gray" weight="bold" size="xs">
          YOUR UNIVERSITY
        </UIText>
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
            {universities.map(({ id, name, authMethod }) => (
              <UIRow
                key={id}
                onClick={() => setSelectedId(id)}
                selected={id === selectedUniversity?.id}
                iconText={id.toUpperCase().slice(0, 3)}
                topText={id.toUpperCase()}
                fullName={name}
                bottomText={authMethod === 'OTP' ? 'Email code' : authMethod}
              />
            ))}
          </div>
        )}
      </div>
      <UIButton
        className="w-full"
        bg="gradient"
        leftIcon={ShieldCheck}
        onClick={handleContinue}
        disabled={!selectedUniversity || isError}
      >
        <UIText weight="semibold" color="white">
          {selectedUniversity
            ? `Continue with ${selectedUniversity.authMethod === 'OTP' ? 'Email code' : selectedUniversity.authMethod}`
            : 'Continue'}
        </UIText>
      </UIButton>
      <div className="flex flex-row items-start gap-2.5 rounded-xl bg-ice px-3 py-2">
        <BadgeCheck className="text-blue" size={22} />
        <UIText size="sm" color="secondary" className="max-w-110 min-w-0">
          Only active students of supported Lublin universities can create an account. Staff and
          alumni accounts are rejected.
        </UIText>
      </div>
    </AuthPage>
  );
}
