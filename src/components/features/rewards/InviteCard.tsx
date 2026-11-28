import { useTranslation } from 'react-i18next';
import { useMyInviteCode, usePhoneViewport } from '@/hooks';
import { UIButton, UIPanel, UIQueryError } from '@/ui/components';
import { captureAnalytics, inviteUrl, toast } from '@/utils';

/** The student's invitation code, shared as an https link that opens the app or this site. */
export function InviteCard() {
  const { t } = useTranslation();
  const { data: invite, isPending, isError, refetch } = useMyInviteCode();
  const isPhone = usePhoneViewport();

  async function shareInvite(code: string): Promise<void> {
    const url = inviteUrl(code);
    // The link goes as its own item, so the share target builds the preview card from it, as on mobile.
    if (navigator.share) {
      try {
        await navigator.share({ text: t('rewards.invitePitch'), url });
        captureAnalytics('invite_shared');
      } catch {
        // Closing the share sheet rejects too; nothing to report.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      captureAnalytics('invite_link_copied');
      toast.success(t('rewards.inviteLinkCopied'));
    } catch {
      toast.error(t('apiState.error'));
    }
  }

  if (isPending && isPhone) {
    return (
      <div
        role="status"
        aria-label={t('apiState.loading')}
        className="h-29 animate-pulse rounded-2xl bg-white-5"
      />
    );
  }
  if (isPending) return <p role="status">{t('apiState.loading')}</p>;
  if (isError) return <UIQueryError retry={() => void refetch()} />;
  if (isPhone) {
    // the mobile app's invite card: the code on one row, a full-width button under it
    return (
      <section className="flex flex-col gap-3 rounded-2xl p-4 glass">
        <div className="flex items-center justify-between gap-3">
          <p className="text-detail text-secondary">{t('rewards.inviteCode')}</p>
          <p className="text-body font-semibold">{invite.code}</p>
        </div>
        <UIButton
          bg="secondary"
          size="sm"
          className="w-full rounded-xl"
          onClick={() => void shareInvite(invite.code)}
        >
          {t('rewards.inviteFriends')}
        </UIButton>
      </section>
    );
  }

  return (
    // max-lg:-order-1: on a phone the rewards page lists it above the quests, as the app does
    <UIPanel className="flex items-center justify-between gap-4 max-lg:-order-1 max-lg:rounded-2xl max-lg:p-4">
      <div className="min-w-0">
        <p className="text-detail text-secondary">{t('rewards.inviteCode')}</p>
        <p className="font-mono text-section font-semibold tracking-widest max-lg:text-body">
          {invite.code}
        </p>
      </div>
      <UIButton bg="secondary" size="sm" onClick={() => void shareInvite(invite.code)}>
        {t('rewards.inviteFriends')}
      </UIButton>
    </UIPanel>
  );
}
