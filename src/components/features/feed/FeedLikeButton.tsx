import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCompactNumber, toast } from '@/utils';
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
  const { t, i18n } = useTranslation();
  const { mutateAsync, isPending } = useFeedLike();
  const [popping, setPopping] = useState(false);
  async function toggleLike(): Promise<void> {
    // Without motion there's no animationend to clear the pop, so skip it.
    if (!liked && !matchMedia('(prefers-reduced-motion: reduce)').matches) setPopping(true);
    try {
      await mutateAsync({ id, kind, liked: !liked });
    } catch {
      toast.error(t('apiState.error'));
    }
  }
  return (
    <UIButton
      bg="transparent"
      size="pill"
      className={cn(
        'min-h-0 gap-1.5 border-0 p-0 enabled:hover:bg-transparent',
        // on a phone, the mobile app's muted heart and 13px count
        'max-lg:gap-1.25 max-lg:text-detail max-lg:font-semibold',
        liked ? 'text-danger' : 'max-lg:text-white-60',
      )}
      disabled={isPending}
      aria-label={`${t(liked ? 'apiState.unlike' : 'apiState.like')} (${new Intl.NumberFormat(i18n.resolvedLanguage).format(count)})`}
      aria-pressed={liked}
      onClick={toggleLike}
    >
      <Heart
        size={16}
        fill={liked || popping ? 'currentColor' : 'none'}
        className={cn(
          'max-lg:size-3.5',
          popping && 'animate-like-pop text-danger max-lg:[animation-duration:210ms]',
        )}
        onAnimationEnd={() => setPopping(false)}
        aria-hidden="true"
      />{' '}
      {formatCompactNumber(count, i18n.resolvedLanguage)}
    </UIButton>
  );
}
