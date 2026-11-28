import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LoaderCircle } from 'lucide-react';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { apiErrorCode } from '@/api';
import { myProfileQueryOptions, useRedeemInvite } from '@/hooks';
import { clearInviteCode, saveInviteCode, toast } from '@/utils';

// below Tailwind's `lg`, where the site mirrors the mobile app
const PHONE_QUERY = '(max-width: 1023.98px)';

const ERROR_KEYS = {
  invalid_referral_code: 'rewards.redeemInvalid',
  referral_already_set: 'rewards.redeemAlreadySet',
  referral_window_closed: 'rewards.redeemWindowClosed',
} as const;

export const Route = createFileRoute('/invite/$code')({
  beforeLoad: async ({ params, context }) => {
    clearInviteCode();
    saveInviteCode(params.code);
    // A guest uses the saved code when signing up. Signed in, a desktop applies it on Rewards;
    // a phone applies it at once and opens the feed, as the mobile app does.
    const signedIn = await context.queryClient
      .ensureQueryData({ ...myProfileQueryOptions(), retry: false })
      .then(
        () => true,
        () => false,
      );
    if (!signedIn) throw redirect({ to: '/login', replace: true });
    if (!window.matchMedia(PHONE_QUERY).matches) throw redirect({ to: '/rewards', replace: true });
  },
  component: InvitePage,
});

function InvitePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { code } = Route.useParams();
  const { mutate: redeem } = useRedeemInvite();
  // effects can run twice; the code is applied once
  const hasRedeemed = useRef(false);

  useEffect(() => {
    if (hasRedeemed.current) return;
    hasRedeemed.current = true;
    redeem(code, {
      // a paid redeem already shows the coin toast; 0 means this code was applied before
      onSuccess: ({ coinsEarned }) => {
        if (!coinsEarned) toast.success(t('rewards.redeemApplied'));
      },
      onError: (error) => {
        const errorCode = apiErrorCode(error);
        toast.error(
          t(
            errorCode && errorCode in ERROR_KEYS
              ? ERROR_KEYS[errorCode as keyof typeof ERROR_KEYS]
              : 'apiState.error',
          ),
        );
      },
      onSettled: () => {
        clearInviteCode();
        void navigate({ to: '/feed', replace: true });
      },
    });
  }, [code, navigate, redeem, t]);

  return (
    <div role="status" className="grid min-h-svh place-items-center bg-ink">
      <LoaderCircle size={24} aria-hidden className="text-white motion-safe:animate-spin" />
    </div>
  );
}
