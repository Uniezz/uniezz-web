import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'skullet/react';
import { useFaqEntries } from '@/hooks';
import { useInView } from 'react-intersection-observer';
import { UIEmpty, UIPanel, UIQueryError, UISearch } from '@/ui/components';
import { matchesSearch } from '@/utils';

export function FaqList() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useFaqEntries();
  const entries = (data?.pages.flatMap((page) => page.items ?? []) ?? []).filter((entry) =>
    matchesSearch(search, entry.question, entry.answer),
  );
  // The next page loads once the end of the list scrolls into view.
  const { ref: endRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <UISearch value={search} onChange={setSearch} label={t('faq.search')} />
      {isPending ? (
        <Skeleton loading label={t('apiState.loading')}>
          <div inert className="space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <UIPanel key={index} surface="tint" className="rounded-programme p-4">
                <p className="text-section font-bold">{t('faq.title')}</p>
              </UIPanel>
            ))}
          </div>
        </Skeleton>
      ) : entries.length === 0 && !isError ? (
        <UIEmpty>
          <p>{t(search.trim() ? 'faq.noResults' : 'faq.empty')}</p>
        </UIEmpty>
      ) : (
        // Not virtualised: the FAQ is short, and an answer opening must not re-layout every row
        // or close again when it scrolls away.
        <div
          role="list"
          aria-label={t('faq.title')}
          className="min-h-0 flex-1 overflow-y-auto motion-safe:animate-rise-in"
        >
          {entries.map((entry) => (
            <div key={entry.id} role="listitem" className="pb-3">
              <UIPanel surface="tint" className="rounded-programme p-4">
                <details className="group">
                  <summary
                    data-ph-capture-attribute-label="Toggle FAQ answer"
                    className="flex cursor-pointer list-none items-center justify-between gap-3 text-section font-bold [&::-webkit-details-marker]:hidden"
                  >
                    {entry.question}
                    <ChevronDown
                      size={16}
                      className="shrink-0 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="mt-3 whitespace-pre-line text-secondary">{entry.answer}</p>
                </details>
              </UIPanel>
            </div>
          ))}
          <div ref={endRef} aria-hidden="true" />
        </div>
      )}
      {isError && <UIQueryError retry={() => void refetch()} />}
    </div>
  );
}
