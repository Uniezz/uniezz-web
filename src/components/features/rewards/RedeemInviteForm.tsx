import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiErrorCode } from '@/api';
import { useMyProfile, usePhoneViewport, useRedeemInvite } from '@/hooks';
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
  const isPhone = usePhoneViewport();

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

  const handleCodeChange = (value: string) =>
    setCode(
      value
        .replace(/[^a-z0-9]/gi, '')
        .toUpperCase()
        .slice(0, CODE_LENGTH),
    );
  if (isPhone) {
    // the mobile app's RedeemInviteCard: title and hint over a full-width field and button
    return (
      <form
        onSubmit={(event) => void submit(event)}
        className="flex flex-col gap-2 rounded-2xl p-4 glass"
      >
        <label htmlFor="redeem-invite-code" className="mb-1 flex flex-col gap-1">
          <span className="text-body font-semibold">{t('rewards.redeemTitle')}</span>
          <span className="text-detail text-secondary">{t('rewards.redeemHint')}</span>
        </label>
        <input
          id="redeem-invite-code"
          className="app-control w-full tracking-[2px]"
          value={code}
          placeholder="A1B2C3D"
          enterKeyHint="done"
          onChange={(event) => handleCodeChange(event.target.value)}
          maxLength={CODE_LENGTH}
          autoComplete="off"
          spellCheck={false}
          disabled={isPending}
        />
        <UIButton
          type="submit"
          bg="secondary"
          size="sm"
          className="w-full rounded-xl"
          disabled={isPending || code.length !== CODE_LENGTH}
        >
          {t('rewards.redeemSubmit')}
        </UIButton>
      </form>
    );
  }

  return (
    <UIPanel className="max-lg:-order-1 max-lg:rounded-2xl max-lg:p-4">
      <form onSubmit={(event) => void submit(event)} className="space-y-3">
        <label htmlFor="redeem-invite-code" className="block">
          <span className="block text-section font-semibold max-lg:text-body">
            {t('rewards.redeemTitle')}
          </span>
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
