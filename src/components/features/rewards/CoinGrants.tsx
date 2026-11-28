import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import { useEndReached, useMyCoinGrants, usePhoneViewport } from '@/hooks';
import { UIEmpty, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { coinGrantReasonLabel, formatCompactNumber } from '@/utils';

/** The coins the student has earned, newest first. */
export function CoinGrants() {
  const { t, i18n } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useMyCoinGrants();
  const grants = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const formatDate = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const isPhone = usePhoneViewport();
  const endRef = useEndReached<HTMLDivElement>(() => {
    if (isPhone && hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
  });

  if (isPhone) {
    // the mobile app's grant rows: part of the page's own scroll, paged as it nears the end
    return (
      <>
        {isPending ? (
          <GrantSkeletons count={5} />
        ) : isError && grants.length === 0 ? (
          <UIQueryError retry={() => void refetch()} />
        ) : grants.length === 0 ? (
          <UIEmpty>
            <p>{t('rewards.historyEmptyApp')}</p>
          </UIEmpty>
        ) : (
          <ul aria-label={t('rewards.historyTitle')}>
            {grants.map((grant, index) => (
              <li
                key={`${grant.createdAt}-${index}`}
                className="flex items-center gap-3 border-b border-white/8 py-2.5"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-body font-medium">
                    {t(coinGrantReasonLabel(grant.reason))}
                  </span>
                  <span className="text-micro text-secondary">
                    {formatDate.format(new Date(grant.createdAt))}
                  </span>
                </div>
                <span className="shrink-0 text-body font-semibold text-amber tabular-nums">
                  +{formatCompactNumber(grant.amount, i18n.resolvedLanguage)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {isFetchingNextPage && <GrantSkeletons count={1} />}
        <div ref={endRef} aria-hidden="true" />
      </>
    );
  }

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
          // on a phone, as the app's grant row: the date under the reason, the amber amount on the right
          className="flex items-baseline gap-4 border-b border-white-10 py-3 text-label max-lg:grid max-lg:grid-cols-[minmax(0,1fr)_auto] max-lg:items-center max-lg:gap-x-3 max-lg:gap-y-0.5 max-lg:py-2.5 max-lg:text-body"
        >
          <span className="min-w-0 flex-1 truncate max-lg:font-medium">
            {t(coinGrantReasonLabel(grant.reason))}
          </span>
          <span className="shrink-0 text-detail text-secondary max-lg:row-start-2 max-lg:text-micro">
            {formatDate.format(new Date(grant.createdAt))}
          </span>
          <span className="w-12 shrink-0 text-right font-semibold tabular-nums max-lg:col-start-2 max-lg:row-span-2 max-lg:row-start-1 max-lg:w-auto max-lg:text-amber">
            +{formatCompactNumber(grant.amount, i18n.resolvedLanguage)}
          </span>
        </div>
      )}
    />
  );
}

/** The mobile app's UISkeletonText rows while grants load. */
function GrantSkeletons({ count }: { count: number }) {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3 py-2">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex flex-col gap-1.5">
          <span className="h-3 w-4/5 animate-pulse rounded-full bg-white-10" />
          <span className="h-3 w-2/5 animate-pulse rounded-full bg-white-10" />
        </div>
      ))}
    </div>
  );
}
