import { AuthPage } from '@/components';
import { UIButton, UIRow, UIText } from '@/ui/components';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const items = [
  {
    iconText: 'UM',
    topText: 'UMCS',
    bottomText: 'USOS',
  },
  {
    iconText: 'KUL',
    topText: 'KUL',
    bottomText: 'Microsoft',
  },
  {
    iconText: 'PL',
    topText: 'Politechnika Lubelska',
    bottomText: 'Microsoft',
  },
  {
    iconText: 'UP',
    topText: 'Uniwersytet Przyrodniczy',
    bottomText: 'Microsoft',
  },
  {
    iconText: 'WS',
    topText: 'WSEI',
    bottomText: 'Microsoft',
  },
];

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const selectedItem = items[selected]!;

  const handleContinue = () => {
    void navigate({
      to: selectedItem.bottomText === 'Microsoft' ? '/otp' : '/usos',
    });
  };

  return (
    <AuthPage topText={t('auth.login.title')} bottomText={t('auth.login.subtitle')}>
      <div className="flex flex-col gap-2.5">
        <UIText color="gray" weight="bold" size="xs">
          {t('auth.login.yourUniversity')}
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
          {t('auth.login.continueWith', { provider: selectedItem.bottomText })}
        </UIText>
      </UIButton>
      <div className="flex flex-row items-start gap-2.5 rounded-xl bg-ice px-4 py-3">
        <BadgeCheck className="text-blue" size={22} />
        <UIText size="sm" color="secondary" className="max-w-110 min-w-0">
          {t('auth.login.notice')}
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
