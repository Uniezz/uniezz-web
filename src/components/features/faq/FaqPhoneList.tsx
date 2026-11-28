import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useEndReached } from '@/hooks';
import { UIEmpty, UIQueryError } from '@/ui/components';

export type FaqPhoneListProps = {
  label: string;
  isPending: boolean;
  isError: boolean;
  isEmpty: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
  refetch: () => unknown;
  /** FaqItem rows. */
  children: ReactNode;
};

/** The mobile app's FAQ list on a phone: glass cards on the page, paged as it scrolls. */
export function FaqPhoneList({
  label,
  isPending,
  isError,
  isEmpty,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  refetch,
  children,
}: FaqPhoneListProps) {
  const { t } = useTranslation();
  const endRef = useEndReached<HTMLDivElement>(() => {
    if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
  });
  const handleRetry = () => void refetch();
  return (
    <>
      {isPending ? (
        <div role="status" aria-label={t('apiState.loading')} className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((key) => (
            <FaqItemSkeleton key={key} />
          ))}
        </div>
      ) : isError && isEmpty ? (
        <UIQueryError retry={handleRetry} />
      ) : isEmpty ? (
        // the cat sits in the middle of the screen, as in the app
        <UIEmpty isScreenCentred>
          <p>{t('faq.empty')}</p>
        </UIEmpty>
      ) : (
        <ul aria-label={label} className="flex flex-col gap-2">
          {children}
        </ul>
      )}
      {isFetchingNextPage && (
        <div className="mt-2">
          <FaqItemSkeleton />
        </div>
      )}
      <div ref={endRef} aria-hidden="true" />
    </>
  );
}

/** The mobile app's FaqItemSkeleton: a glass card with two text bars. */
function FaqItemSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2 rounded-2xl p-3.5 glass">
      <span className="h-3.5 w-[85%] animate-pulse rounded-[7px] bg-white-10" />
      <span className="h-3.5 w-1/2 animate-pulse rounded-[7px] bg-white-10" />
    </div>
  );
}
