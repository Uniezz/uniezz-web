import { useTranslation } from 'react-i18next';
import { useMyFaqProposals } from '@/hooks';
import { matchesSearch } from '@/utils';
import { FaqItem } from './FaqItem';
import { FaqPhoneList } from './FaqPhoneList';

/** Phone-only: the student's own suggestions, collapsed like the published ones. */
export function FaqPhoneProposals({ search }: { search: string }) {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useMyFaqProposals();
  const proposals = (data?.pages.flatMap((page) => page.items ?? []) ?? []).filter((proposal) =>
    matchesSearch(search, proposal.question, proposal.answer),
  );
  return (
    <FaqPhoneList
      label={t('faq.myProposals')}
      isPending={isPending}
      isError={isError}
      isEmpty={proposals.length === 0}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      refetch={refetch}
    >
      {proposals.map((proposal) => (
        <FaqItem
          key={proposal.id}
          question={proposal.question}
          answer={proposal.answer}
          status={proposal.status}
        />
      ))}
    </FaqPhoneList>
  );
}
