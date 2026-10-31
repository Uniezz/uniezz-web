import { useTranslation } from 'react-i18next';
import { UIPanel, UISkeleton } from '@/ui/components';

export function FeedPostsSkeleton() {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      aria-label={t('apiState.loading')}
      className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <UIPanel key={index} className="overflow-hidden p-0">
          <UISkeleton className="h-50 rounded-none" />
          <div className="space-y-3 p-5.5">
            <UISkeleton className="h-4 w-2/5" />
            <UISkeleton className="h-4 w-1/3" />
            <UISkeleton className="h-6 w-4/5" />
          </div>
        </UIPanel>
      ))}
    </div>
  );
}
