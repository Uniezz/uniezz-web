import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useFeedLike } from '@/hooks';
import { UIButton } from '@/ui/components';
import { cn } from '@/ui/cn';

export function FeedLikeButton({
  id,
  kind,
  liked,
  count,
}: {
  id: string;
  kind: 'post' | 'comment';
  liked: boolean;
  count: number;
}) {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useFeedLike();
  return (
    <UIButton
      bg="transparent"
      size="pill"
      className={cn(
        'min-h-0 gap-1.5 border-0 p-0 enabled:hover:bg-transparent',
        liked && 'text-danger',
      )}
      disabled={isPending}
      aria-label={t(liked ? 'apiState.unlike' : 'apiState.like')}
      aria-pressed={liked}
      onClick={async () => {
        try {
          await mutateAsync({ id, kind, liked: !liked });
        } catch {
          toast.error(t('apiState.error'));
        }
      }}
    >
      <Heart size={16} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" /> {count}
    </UIButton>
  );
}
