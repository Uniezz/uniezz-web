import { useTranslation } from 'react-i18next';
import { useFaqEntries } from '@/hooks';
import { matchesSearch } from '@/utils';
import { FaqItem } from './FaqItem';
import { FaqPhoneList } from './FaqPhoneList';

/** Phone-only: the published questions, filtered as the search is typed. */
export function FaqPhoneEntries({ search }: { search: string }) {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useFaqEntries();
  const entries = (data?.pages.flatMap((page) => page.items ?? []) ?? []).filter((entry) =>
    matchesSearch(search, entry.question, entry.answer),
  );
  return (
    <FaqPhoneList
      label={t('faq.allQuestions')}
      isPending={isPending}
      isError={isError}
      isEmpty={entries.length === 0}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      refetch={refetch}
    >
      {entries.map((entry) => (
        <FaqItem key={entry.id} question={entry.question} answer={entry.answer} />
      ))}
    </FaqPhoneList>
  );
}
