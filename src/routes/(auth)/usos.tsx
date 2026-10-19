import { AuthPage } from '@/components';
import { startUniversityLogin } from '@/utils';
import { UIButton, UIText } from '@/ui/components';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, BadgeCheck, ShieldCheck } from 'lucide-react';

export const Route = createFileRoute('/(auth)/usos')({
  component: UsosPage,
});

function UsosPage() {
  const navigate = useNavigate();

  return (
    <AuthPage
      topText="Continue with UMCS"
      bottomText="You'll finish signing in on UMCS's own USOS page. Uniezz never sees your password."
      beforeTitle={
        <button
          type="button"
          onClick={() => void navigate({ to: '/login' })}
          className="flex items-center gap-2 self-start"
        >
          <ArrowLeft size={16} className="text-secondary" />
          <UIText weight="semibold" color="secondary">
            Back to universities
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
        onClick={() => startUniversityLogin()}
      >
        <UIText weight="semibold" color="white">
          Open USOS login
        </UIText>
      </UIButton>
      <div className="flex flex-row items-start gap-2.5 rounded-xl bg-ice px-4 py-3">
        <BadgeCheck className="text-blue" size={22} />
        <UIText size="sm" color="secondary" className="min-w-0">
          UMCS students sign in on USOS. We only receive the identity USOS sends back.
        </UIText>
      </div>
    </AuthPage>
  );
}
