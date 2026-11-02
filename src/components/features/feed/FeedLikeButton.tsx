import { Heart } from 'lucide-react';
import { useState } from 'react';
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
  const [popping, setPopping] = useState(false);
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
        // Without motion there's no animationend to clear the pop, so skip it.
        if (!liked && !matchMedia('(prefers-reduced-motion: reduce)').matches) setPopping(true);
        try {
          await mutateAsync({ id, kind, liked: !liked });
        } catch {
          toast.error(t('apiState.error'));
        }
      }}
    >
      <Heart
        size={16}
        fill={liked || popping ? 'currentColor' : 'none'}
        className={cn(popping && 'animate-like-pop text-danger')}
        onAnimationEnd={() => setPopping(false)}
        aria-hidden="true"
      />{' '}
      {count}
    </UIButton>
  );
}
