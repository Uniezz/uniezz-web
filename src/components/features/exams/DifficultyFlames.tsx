import { Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/ui/cn';

export type DifficultyFlamesProps = { difficulty: number; size?: 14 | 16 };

/** The mobile app's difficulty: five filled amber flames, the unearned ones faded. */
export function DifficultyFlames({ difficulty, size = 14 }: DifficultyFlamesProps) {
  const { t } = useTranslation();
  return (
    <span
      role="img"
      aria-label={t('exams.difficulty', { difficulty })}
      className="flex shrink-0 gap-0.5"
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <Flame
          key={value}
          size={size}
          aria-hidden="true"
          className={cn('fill-amber text-amber', value > difficulty && 'opacity-25')}
        />
      ))}
    </span>
  );
}
