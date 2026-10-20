import { AuthPage } from '@/components';
import { startUniversityLogin } from '@/utils';
import { UIButton, UIText } from '@/ui/components';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, BadgeCheck, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/(auth)/usos')({
  component: UsosPage,
});

function UsosPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <AuthPage
      topText={t('auth.usos.title')}
      bottomText={t('auth.usos.subtitle')}
      beforeTitle={
        <button
          type="button"
          onClick={() => void navigate({ to: '/login' })}
          className="flex items-center gap-2 self-start"
        >
          <ArrowLeft size={16} className="text-secondary" />
          <UIText weight="semibold" color="secondary">
            {t('auth.backToUniversities')}
          </UIText>
        </button>
      }
      headingIcon={
        <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-soft">
          <ShieldCheck size={20} className="text-blue-light" />
        </div>
      }
    >
      <UIButton
        className="w-full"
        bg="gradient"
        leftIcon={ShieldCheck}
        onClick={startUniversityLogin}
      >
        <UIText weight="semibold" color="white">
          {t('auth.usos.open')}
        </UIText>
      </UIButton>
      <div className="flex flex-row items-start gap-2.5 rounded-xl bg-ice px-4 py-3">
        <BadgeCheck className="text-blue" size={22} />
        <UIText size="sm" color="secondary" className="min-w-0">
          {t('auth.usos.notice')}
        </UIText>
      </div>
    </AuthPage>
  );
}
