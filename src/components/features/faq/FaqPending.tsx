import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import { useApproveFaqProposal, usePendingFaqProposals } from '@/hooks';
import { UIButton, UIEmpty, UIPanel, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { toast } from '@/utils';

/** Proposals waiting for a moderator; only FAQ publishers see this tab. */
export function FaqPending() {
  const { t } = useTranslation();
  const { data, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    usePendingFaqProposals();
  const { mutateAsync: approve, isPending: isApproving } = useApproveFaqProposal();
  const proposals = data?.pages.flatMap((page) => page.items ?? []) ?? [];

  async function approveProposal(id: string) {
    try {
      await approve(id);
      toast.success(t('faq.approved'));
    } catch {
      toast.error(t('apiState.error'));
    }
  }

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
          <div role="listitem" className="pb-3">
            <UIPanel surface="tint" className="rounded-programme p-4">
              <h3 className="text-section font-bold wrap-anywhere">{proposal.question}</h3>
              <p className="mt-3 whitespace-pre-line text-secondary">{proposal.answer}</p>
              <div className="mt-4 flex justify-end">
                <UIButton
                  size="sm"
                  disabled={isApproving}
                  onClick={() => void approveProposal(proposal.id)}
                >
                  {t('faq.approve')}
                </UIButton>
              </div>
            </UIPanel>
          </div>
        )}
      />
      {isError && <UIQueryError retry={() => void refetch()} />}
    </div>
  );
}
