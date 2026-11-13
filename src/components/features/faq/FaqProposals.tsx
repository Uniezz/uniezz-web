import { useTranslation } from 'react-i18next';
import { Skeleton } from 'skullet/react';
import { Virtuoso } from 'react-virtuoso';
import { useMyFaqProposals } from '@/hooks';
import { UIEmpty, UIPanel, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';

const statusLabels = {
  proposed: 'faq.statusProposed',
  published: 'faq.statusPublished',
  rejected: 'faq.statusRejected',
} as const;

export function FaqProposals() {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useMyFaqProposals();
  const proposals = data?.pages.flatMap((page) => page.items ?? []) ?? [];

  if (isPending) {
    return (
      <Skeleton loading label={t('apiState.loading')}>
        <div inert className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <UIPanel key={index} surface="tint" className="rounded-programme p-4">
              <p className="text-section font-bold">{t('faq.title')}</p>
            </UIPanel>
          ))}
        </div>
      </Skeleton>
    );
  }

  if (!isError && proposals.length === 0) {
    return (
      <UIEmpty>
        <p>{t('faq.noProposals')}</p>
      </UIEmpty>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <Virtuoso
        data={proposals}
        computeItemKey={(_, proposal) => proposal.id}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
        }}
        components={listComponents}
        aria-label={t('faq.myProposals')}
        className="min-h-0 flex-1 motion-safe:animate-rise-in"
        itemContent={(_, proposal) => (
          <div role="listitem" className="pb-3">
            <UIPanel surface="tint" className="rounded-programme p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="min-w-0 text-section font-bold wrap-anywhere">
                  {proposal.question}
                </h3>
                <span className="shrink-0 rounded-full border border-white-10 bg-white-5 px-2 py-1 text-micro font-semibold text-secondary">
                  {t(statusLabels[proposal.status])}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-line text-secondary">{proposal.answer}</p>
            </UIPanel>
          </div>
        )}
      />
      {isError && <UIQueryError retry={() => void refetch()} />}
    </div>
  );
}
