import { UserMinus, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PublicProfile } from '@/@types';
import { useFollowProfile } from '@/hooks';
import { cn } from '@/ui/cn';
import { UIButton } from '@/ui/components';
import { toast } from '@/utils';

export function FollowButton({ profile }: { profile: PublicProfile }) {
  const { t } = useTranslation();
  const { mutate: follow, isPending } = useFollowProfile();
  const following = profile.followedByMe;

  return (
    <UIButton
      size="sm"
      bg={following ? 'ghost' : 'primary'}
      leftIcon={following ? UserMinus : UserPlus}
      aria-pressed={following}
      disabled={isPending}
      data-ph-capture-attribute-label={following ? 'Unfollow student' : 'Follow student'}
      className={cn('h-9 min-h-9 px-4 py-0 text-detail', following && 'border-white/40')}
      onClick={() =>
        follow(
          { id: profile.id, follow: !following },
          {
            onSuccess: () =>
              toast.success(t(following ? 'follows.unfollowed' : 'follows.followed')),
            onError: () => toast.error(t('apiState.error')),
          },
        )
      }
    >
      {t(following ? 'follows.unfollow' : 'follows.follow')}
    </UIButton>
  );
}
