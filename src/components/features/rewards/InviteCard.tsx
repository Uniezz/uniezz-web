import { useTranslation } from 'react-i18next';
import { useMyInviteCode } from '@/hooks';
import { UIButton, UIPanel, UIQueryError } from '@/ui/components';
import { captureAnalytics, inviteUrl, toast } from '@/utils';

/** The student's invitation code, shared as an https link that opens the app or this site. */
export function InviteCard() {
  const { t } = useTranslation();
  const { data: invite, isPending, isError, refetch } = useMyInviteCode();

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

  if (isPending) return <p role="status">{t('apiState.loading')}</p>;
  if (isError) return <UIQueryError retry={() => void refetch()} />;

  return (
    <UIPanel className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-detail text-secondary">{t('rewards.inviteCode')}</p>
        <p className="font-mono text-section font-semibold tracking-widest">{invite.code}</p>
      </div>
      <UIButton bg="secondary" size="sm" onClick={() => void shareInvite(invite.code)}>
        {t('rewards.inviteFriends')}
      </UIButton>
    </UIPanel>
  );
}
