import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import type { FaqEntry } from '@/@types';
import { usePendingFaqProposals } from '@/hooks';
import { UIButton, UIEmpty, UIPanel, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { FaqApprovalDialog } from './FaqApprovalDialog';

/** Proposals waiting for a moderator; only moderators and admins see this tab. */
export function FaqPending() {
  const { t } = useTranslation();
  const { data, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    usePendingFaqProposals();
  const [approving, setApproving] = useState<FaqEntry | null>(null);
  const proposals = data?.pages.flatMap((page) => page.items ?? []) ?? [];

  if (!isError && proposals.length === 0) {
    return (
      <UIEmpty>
        <p>{t('faq.noPending')}</p>
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
        aria-label={t('faq.pending')}
        className="min-h-0 flex-1 motion-safe:animate-rise-in"
        itemContent={(_, proposal) => (
          <div role="listitem" className="pb-3 max-lg:pb-2">
            <UIPanel
              surface="tint"
              className="rounded-programme p-4 max-lg:rounded-2xl max-lg:p-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-section font-bold wrap-anywhere max-lg:min-w-0 max-lg:text-body max-lg:font-semibold">
                  {proposal.question}
                </h3>
                <span className="app-tag shrink-0 border-white-20 bg-surface px-2 py-1 uppercase">
                  {proposal.language}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-line text-secondary max-lg:mt-2 max-lg:wrap-anywhere">
                {proposal.answer}
              </p>
              <div className="mt-4 flex justify-end">
                <UIButton size="sm" onClick={() => setApproving(proposal)}>
                  {t('faq.translate')}
                </UIButton>
              </div>
            </UIPanel>
          </div>
        )}
      />
      {isError && <UIQueryError retry={() => void refetch()} />}
      {approving && <FaqApprovalDialog proposal={approving} onClose={() => setApproving(null)} />}
    </div>
  );
}
