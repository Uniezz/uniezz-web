import { useTranslation } from 'react-i18next';
import type { GrantModeratorButtonProps } from '@/@types';
import { useGrantModerator } from '@/hooks';
import { ConfirmActionButton } from './ConfirmActionButton';

/** Admins make a student a moderator from their profile; granting again changes nothing. */
export function GrantModeratorButton({ userId, icon }: GrantModeratorButtonProps) {
  const { t } = useTranslation();
  const { mutateAsync: grant } = useGrantModerator();
  return (
    <ConfirmActionButton
      label={t('moderation.grant')}
      description={t('moderation.grantDescription')}
      success={t('moderation.granted')}
      onConfirm={() => grant(userId)}
      icon={icon}
    />
  );
}
