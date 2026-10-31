import { useTranslation } from 'react-i18next';
import { UISkeleton } from '@/ui/components';

export function FeedCommentsSkeleton() {
  const { t } = useTranslation();

  return (
    <div role="status" aria-label={t('apiState.loading')} className="space-y-5">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex gap-3">
          <UISkeleton className="size-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <UISkeleton className="h-4 w-1/3" />
            <UISkeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
