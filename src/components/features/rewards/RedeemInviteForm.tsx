import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiErrorCode } from '@/api';
import { useMyProfile, useRedeemInvite } from '@/hooks';
import { UIButton, UIPanel } from '@/ui/components';
import { canRedeemInvite, clearInviteCode, getInviteCode, toast } from '@/utils';

const CODE_LENGTH = 7;

const ERROR_KEYS = {
  invalid_referral_code: 'rewards.redeemInvalid',
  referral_already_set: 'rewards.redeemAlreadySet',
  referral_window_closed: 'rewards.redeemWindowClosed',
} as const;

/** Lets a new student apply a friend's invite code; an /invite link opened while signed in prefills it. */
export function RedeemInviteForm() {
  const { t } = useTranslation();
  const { data: profile } = useMyProfile();
  const [code, setCode] = useState(() => getInviteCode() ?? '');
  const { mutateAsync: redeem, isPending } = useRedeemInvite();

  if (!profile || !canRedeemInvite(profile.createdAt)) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { coinsEarned } = await redeem(code);
      clearInviteCode();
      setCode('');
      // A paid redeem already shows the coin toast; 0 means this code was applied before.
      if (!coinsEarned) toast.success(t('rewards.redeemApplied'));
    } catch (error) {
      const errorCode = apiErrorCode(error);
      toast.error(
        t(
          errorCode && errorCode in ERROR_KEYS
            ? ERROR_KEYS[errorCode as keyof typeof ERROR_KEYS]
            : 'apiState.error',
        ),
      );
    }
  }

  return (
    <UIPanel>
      <form onSubmit={(event) => void submit(event)} className="space-y-3">
        <label htmlFor="redeem-invite-code" className="block">
          <span className="block text-section font-semibold">{t('rewards.redeemTitle')}</span>
          <span className="mt-1 block text-detail text-secondary">{t('rewards.redeemHint')}</span>
        </label>
        <div className="flex gap-2">
          <input
            id="redeem-invite-code"
            className="app-control min-w-0 flex-1 font-mono tracking-widest uppercase"
            value={code}
            onChange={(event) =>
              setCode(
                event.target.value
                  .replace(/[^a-z0-9]/gi, '')
                  .toUpperCase()
                  .slice(0, CODE_LENGTH),
              )
            }
            maxLength={CODE_LENGTH}
            autoComplete="off"
            spellCheck={false}
            disabled={isPending}
          />
          <UIButton
            type="submit"
            bg="secondary"
            size="sm"
            disabled={isPending || code.length !== CODE_LENGTH}
          >
            {t('rewards.redeemSubmit')}
          </UIButton>
        </div>
      </form>
    </UIPanel>
  );
}
