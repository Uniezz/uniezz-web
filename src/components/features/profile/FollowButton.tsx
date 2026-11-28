import { UserMinus, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PublicProfile } from '@/@types';
import { useFollowProfile, usePhoneViewport } from '@/hooks';
import { cn } from '@/ui/cn';
import { UIButton } from '@/ui/components';
import { toast } from '@/utils';

export function FollowButton({ profile }: { profile: PublicProfile }) {
  const { t } = useTranslation();
  const isPhone = usePhoneViewport();
  const { mutate: follow, isPending } = useFollowProfile();
  const following = profile.followedByMe;
  const handleClick = () =>
    follow(
      { id: profile.id, follow: !following },
      {
        // on a phone the button itself shows the result, as in the app
        onSuccess: () => {
          if (!isPhone) toast.success(t(following ? 'follows.unfollowed' : 'follows.followed'));
        },
        onError: () => toast.error(t('apiState.error')),
      },
    );

  return (
    <UIButton
      size="sm"
      bg={following ? 'ghost' : 'primary'}
      leftIcon={following ? UserMinus : UserPlus}
      aria-pressed={following}
      // on a phone it stays enabled while the optimistic request runs
      disabled={isPending && !isPhone}
      data-ph-capture-attribute-label={following ? 'Unfollow student' : 'Follow student'}
      className={cn(
        'h-9 min-h-9 px-4 py-0 text-detail max-lg:h-[31px] max-lg:min-h-[31px] max-lg:px-3.5',
        following && 'border-white/40',
      )}
      onClick={handleClick}
    >
      {/* Icon only on a phone, as in the app, where the label overflows in longer languages. */}
      <span className="max-lg:sr-only">{t(following ? 'follows.unfollow' : 'follows.follow')}</span>
    </UIButton>
  );
}
