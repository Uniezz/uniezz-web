import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import { usePendingReports } from '@/hooks';
import { UIEmpty, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { ReportItem } from './ReportItem';

/** Pending reports, newest first; settling one removes it and its duplicates from the queue. */
export function ReportQueue() {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    usePendingReports();
  const reports = data?.pages.flatMap((page) => page.items ?? []) ?? [];

  if (isPending) return <p role="status">{t('apiState.loading')}</p>;
  if (isError && reports.length === 0) return <UIQueryError retry={() => void refetch()} />;
  if (reports.length === 0) {
    return (
      <UIEmpty>
        <p>{t('moderation.noReports')}</p>
      </UIEmpty>
    );
  }

  return (
    <Virtuoso
      data={reports}
      computeItemKey={(_, report) => report.id}
      endReached={() => {
        if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
      }}
      components={listComponents}
      aria-label={t('moderation.reports')}
      className="min-h-0 flex-1 motion-safe:animate-rise-in"
      itemContent={(_, report) => (
        <div role="listitem" className="pb-3">
          <ReportItem report={report} />
        </div>
      )}
    />
  );
}
