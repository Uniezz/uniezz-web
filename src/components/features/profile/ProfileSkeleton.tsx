import { useTranslation } from 'react-i18next';
import { UIPanel, UISkeleton } from '@/ui/components';

export function ProfileSkeleton() {
  const { t } = useTranslation();

  return (
    <div role="status" aria-label={t('apiState.loading')} className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <UISkeleton className="h-10 w-60" />
        <UISkeleton className="h-9 w-32 rounded-full" />
      </div>
      <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
        <div className="space-y-4">
          <UIPanel surface="tint" className="rounded-profile text-center">
            <UISkeleton className="mx-auto mb-4.5 size-22 rounded-full" />
            <UISkeleton className="mx-auto h-6 w-3/4" />
            <UISkeleton className="mx-auto mt-2 h-4 w-4/5" />
            <UISkeleton className="mt-4.5 h-10 w-full" />
          </UIPanel>
          <UIPanel surface="tint" className="rounded-profile p-4.5">
            <UISkeleton className="mb-3.5 h-6 w-2/3" />
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="flex h-6 items-center justify-between">
                  <UISkeleton className="h-4 w-2/5" />
                  <UISkeleton className="h-5 w-10 rounded-full" />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-white-10 pt-4">
              <UISkeleton className="h-4 w-1/2" />
              <UISkeleton className="h-9 w-20 rounded-full" />
            </div>
          </UIPanel>
        </div>
        <div className="space-y-4.5">
          <UIPanel surface="tint" className="rounded-profile">
            <UISkeleton className="mb-4 h-6 w-40" />
            <div className="grid gap-3.5 sm:grid-cols-2">
              {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="space-y-2">
                  <UISkeleton className="h-4 w-1/3" />
                  <UISkeleton className="h-12 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </UIPanel>
          <div className="flex items-center justify-between gap-4">
            <UISkeleton className="h-6 w-40" />
            <UISkeleton className="h-9 w-36 rounded-full" />
          </div>
          <UIPanel surface="tint" className="rounded-programme p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <UISkeleton className="h-6 w-1/3" />
              <UISkeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_125px]">
              <div className="space-y-2 rounded-lg bg-white-5 px-2.5 py-2">
                <UISkeleton className="h-3 w-1/4" />
                <UISkeleton className="h-5 w-2/3" />
              </div>
              <div className="space-y-2 rounded-lg bg-white-5 px-2.5 py-2">
                <UISkeleton className="h-3 w-2/3" />
                <UISkeleton className="h-5 w-1/2" />
              </div>
            </div>
          </UIPanel>
        </div>
      </div>
    </div>
  );
}
