import { AuthPage } from '@/components';
import { UIButton, UIRow, UIText } from '@/ui/components';
import { startUniversityLogin } from '@/utils';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const items = [
  {
    iconText: 'UM',
    topText: 'UMCS',
    bottomText: 'USOS',
    provider: 'usos',
  },
  {
    iconText: 'KUL',
    topText: 'KUL',
    bottomText: 'Email code',
    provider: 'otp',
  },
  {
    iconText: 'PL',
    topText: 'Politechnika Lubelska',
    bottomText: 'Email code',
    provider: 'otp',
  },
  {
    iconText: 'UP',
    topText: 'Uniwersytet Przyrodniczy',
    bottomText: 'Email code',
    provider: 'otp',
  },
  {
    iconText: 'WS',
    topText: 'WSEI',
    bottomText: 'Email code',
    provider: 'otp',
  },
];

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const selectedItem = items[selected]!;

  const handleContinue = () => {
    if (selectedItem.provider === 'usos') {
      startUniversityLogin();
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
        <div className="flex flex-col gap-1.5">
          {items.map((item, index) => (
            <UIRow
              key={item.topText}
              onClick={() => setSelected(index)}
              selected={index === selected}
              iconText={item.iconText}
              topText={item.topText}
              bottomText={item.bottomText}
            />
          ))}
        </div>
      </div>
      <UIButton className="w-full" bg="gradient" leftIcon={ShieldCheck} onClick={handleContinue}>
        <UIText weight="semibold" color="white">
          Continue with {selectedItem.bottomText}
        </UIText>
      </UIButton>
      <div className="flex flex-row items-start gap-2.5 rounded-xl bg-ice px-4 py-3">
        <BadgeCheck className="text-blue" size={22} />
        <UIText size="sm" color="secondary" className="max-w-110 min-w-0">
          Only active students of the five Lublin universities can create an account. Staff and
          alumni accounts are rejected.
        </UIText>
      </div>
      {/* TODO(temp): skip login button  */}
      {import.meta.env.DEV ? (
        <UIButton className="w-full" bg="secondary" navigateTo="/feed">
          <UIText weight="semibold" color="secondary">
            Skip login (dev) → Feed
          </UIText>
        </UIButton>
      ) : null}
    </AuthPage>
  );
}
