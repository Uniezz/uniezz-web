import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useEndReached } from '@/hooks';
import { UIEmpty, UIQueryError } from '@/ui/components';
import { StudyRowSkeleton } from './StudyRowSkeleton';

export type StudyPhoneListProps = {
  label: string;
  isPending: boolean;
  isError: boolean;
  isEmpty: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
  refetch: () => unknown;
  /** Rows: `li` cards. */
  children: ReactNode;
};

/** The mobile app's StudyList on a phone: glass cards on the page, paged as the page scrolls. */
export function StudyPhoneList({
  label,
  isPending,
  isError,
  isEmpty,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  refetch,
  children,
}: StudyPhoneListProps) {
  const { t } = useTranslation();
  const endRef = useEndReached<HTMLDivElement>(() => {
    if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
  });
  const handleRetry = () => void refetch();
  return (
    <>
      {isPending ? (
        <div role="status" aria-label={t('apiState.loading')} className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5, 6].map((key) => (
            <StudyRowSkeleton key={key} />
          ))}
        </div>
      ) : isError && isEmpty ? (
        <div className="flex min-h-[50svh] items-center justify-center p-5 text-center">
          <UIQueryError retry={handleRetry} />
        </div>
      ) : isEmpty ? (
        // the cat sits in the middle of the screen, as in the app
        <div className="flex min-h-[60svh] items-center justify-center">
          <UIEmpty />
        </div>
      ) : (
        <ul aria-label={label} className="flex flex-col gap-2">
          {children}
        </ul>
      )}
      {isFetchingNextPage && (
        <div className="mt-2">
          <StudyRowSkeleton />
        </div>
      )}
      <div ref={endRef} aria-hidden="true" />
    </>
  );
}
