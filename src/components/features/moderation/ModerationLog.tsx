import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import { useModerationActions } from '@/hooks';
import { UIEmpty, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { moderationActionLabel, dateFormatter } from '@/utils';

/** What moderators and admins did, newest first; the backend keeps a year. */
export function ModerationLog() {
  const { t, i18n } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useModerationActions();
  const actions = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const formatDate = dateFormatter(i18n.resolvedLanguage, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  if (isPending) return <p role="status">{t('apiState.loading')}</p>;
  if (isError && actions.length === 0) return <UIQueryError retry={() => void refetch()} />;
  if (actions.length === 0) {
    return (
      <UIEmpty>
        <p>{t('moderation.noActions')}</p>
      </UIEmpty>
    );
  }

  return (
    <Virtuoso
      data={actions}
      computeItemKey={(_, action) => action.id}
      endReached={() => {
        if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
      }}
      components={listComponents}
      aria-label={t('moderation.log')}
      className="min-h-0 flex-1"
      itemContent={(_, action) => (
        <div
          role="listitem"
          className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-white-10 py-3 text-label"
        >
          <span className="min-w-0 flex-1">{t(moderationActionLabel(action.type))}</span>
          <span className="font-mono text-detail text-secondary">{action.targetId}</span>
          <span className="shrink-0 text-detail text-secondary">
            {formatDate.format(new Date(action.createdAt))}
          </span>
        </div>
      )}
    />
  );
}
