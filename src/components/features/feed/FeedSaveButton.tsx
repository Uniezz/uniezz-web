import { Bookmark } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '@/utils';
import { useFeedSave } from '@/hooks';
import { UIButton } from '@/ui/components';
import { cn } from '@/ui/cn';

export function FeedSaveButton({ id, saved }: { id: string; saved: boolean }) {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useFeedSave();
  const [popping, setPopping] = useState(false);
  async function toggleSaved(): Promise<void> {
    // Without motion there's no animationend to clear the pop, so skip it.
    if (!saved && !matchMedia('(prefers-reduced-motion: reduce)').matches) setPopping(true);
    try {
      await mutateAsync({ id, saved: !saved });
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
        saved ? 'text-sky' : 'max-lg:text-white-60',
      )}
      disabled={isPending}
      aria-label={t(saved ? 'apiState.unsave' : 'apiState.save')}
      aria-pressed={saved}
      onClick={toggleSaved}
    >
      <Bookmark
        size={16}
        fill={saved ? 'currentColor' : 'none'}
        className={cn('max-lg:size-3.5', popping && 'animate-like-pop max-lg:animate-none')}
        onAnimationEnd={() => setPopping(false)}
        aria-hidden="true"
      />
    </UIButton>
  );
}
