import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import { useMyCoinGrants } from '@/hooks';
import { UIEmpty, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { coinGrantReasonLabel, formatCompactNumber, dateFormatter } from '@/utils';

/** The coins the student has earned, newest first. */
export function CoinGrants() {
  const { t, i18n } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useMyCoinGrants();
  const grants = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const formatDate = dateFormatter(i18n.resolvedLanguage, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  if (isPending) return <p role="status">{t('apiState.loading')}</p>;
  if (isError && grants.length === 0) return <UIQueryError retry={() => void refetch()} />;
  if (grants.length === 0) {
    return (
      <UIEmpty>
        <p>{t('rewards.historyEmpty')}</p>
      </UIEmpty>
    );
  }

  return (
    <Virtuoso
      data={grants}
      computeItemKey={(index, grant) => `${grant.createdAt}-${index}`}
      endReached={() => {
        if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
      }}
      components={listComponents}
      aria-label={t('rewards.historyTitle')}
      className="min-h-0 flex-1"
      itemContent={(_, grant) => (
        <div
          role="listitem"
          className="flex items-baseline gap-4 border-b border-white-10 py-3 text-label"
        >
          <span className="min-w-0 flex-1 truncate">{t(coinGrantReasonLabel(grant.reason))}</span>
          <span className="shrink-0 text-detail text-secondary">
            {formatDate.format(new Date(grant.createdAt))}
          </span>
          <span className="w-12 shrink-0 text-right font-semibold tabular-nums">
            +{formatCompactNumber(grant.amount, i18n.resolvedLanguage)}
          </span>
        </div>
      )}
    />
  );
}
