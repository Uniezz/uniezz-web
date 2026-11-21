import { Ban, ShieldOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BanButtonProps } from '@/@types';
import { useBan, useBanUser, useUnbanUser } from '@/hooks';
import { ConfirmActionButton } from './ConfirmActionButton';

/** Ban or unban a student, depending on their current state. */
export function BanButton({ userId, iconOnly }: BanButtonProps) {
  const { t } = useTranslation();
  const { data: ban, isPending } = useBan(userId);
  const { mutateAsync: banUser } = useBanUser();
  const { mutateAsync: unbanUser } = useUnbanUser();

  return ban?.bannedAt ? (
    <ConfirmActionButton
      label={t('moderation.unban')}
      description={t('moderation.unbanDescription')}
      success={t('moderation.unbanned')}
      onConfirm={() => unbanUser(userId)}
      icon={iconOnly ? ShieldOff : undefined}
    />
  ) : (
    <ConfirmActionButton
      label={t('moderation.ban')}
      description={t('moderation.banDescription')}
      success={t('moderation.banned')}
      disabled={isPending}
      onConfirm={() => banUser(userId)}
      icon={iconOnly ? Ban : undefined}
      danger
    />
  );
}
