import { useTranslation } from 'react-i18next';
import { UIPanel, UISkeleton } from '@/ui/components';

export function FeedPostSkeleton() {
  const { t } = useTranslation();

  return (
    <div role="status" aria-label={t('apiState.loading')} className="relative mx-auto max-w-5xl">
      <div className="mb-5 inline-flex min-h-11 items-center gap-2 px-2 py-2 xl:absolute xl:top-0 xl:-left-32 xl:mb-0">
        <UISkeleton className="size-5" />
        <UISkeleton className="h-4 w-12" />
      </div>
      <div className="relative">
        <div className="grid min-w-0 items-stretch gap-5 md:h-[calc(100svh-9rem)] md:min-h-0 md:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] xl:h-[calc(100svh-56px)]">
          <UIPanel className="overflow-hidden p-0">
            <div className="bg-ink-20 relative flex aspect-[4/3] items-center justify-center md:aspect-auto md:h-full">
              <UISkeleton className="absolute inset-0 size-full rounded-none" />
            </div>
          </UIPanel>
          <UIPanel className="flex min-h-0 min-w-0 flex-col p-0">
            <div className="max-h-[45%] shrink-0 space-y-3 overflow-y-auto border-b border-white-10 p-5.5 sm:p-6">
              <div className="flex items-center gap-3">
                <UISkeleton className="size-9 shrink-0 rounded-full" />
                <UISkeleton className="h-5 w-2/5" />
              </div>
              <UISkeleton className="h-7 w-3/4" />
              <UISkeleton className="h-4 w-1/2" />
              <UISkeleton className="h-14 w-full" />
            </div>
            <section className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5.5 sm:p-6">
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
            </section>
            <div className="shrink-0 border-t border-white-10 p-4 sm:p-5">
              <UISkeleton className="h-10 w-full rounded-full" />
            </div>
          </UIPanel>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -right-32 -left-32 grid min-h-11 grid-cols-[8rem_minmax(0,1fr)_8rem] items-center max-xl:static max-xl:mt-5 max-xl:flex max-xl:justify-between"
        >
          <UISkeleton className="size-11 justify-self-center rounded-full" />
          <UISkeleton className="col-start-3 row-start-1 size-11 justify-self-center rounded-full" />
        </div>
      </div>
    </div>
  );
}
