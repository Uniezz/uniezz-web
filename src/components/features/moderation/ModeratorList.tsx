import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import { useModerators, useRevokeModerator } from '@/hooks';
import { UIEmpty, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { authorName } from '@/utils';
import { ConfirmActionButton } from './ConfirmActionButton';
import { ModeratorSearch } from './ModeratorSearch';

/** Current moderators on the left, the all-students search to add new ones on the right. */
export function ModeratorList() {
  const { t, i18n } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useModerators();
  const { mutateAsync: revoke } = useRevokeModerator();
  const moderators = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const formatDate = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'medium' });

  return (
    <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-2">
      <section className="flex min-h-0 flex-col gap-4">
        <h2 className="shrink-0 text-section font-semibold">{t('moderation.moderators')}</h2>
        {isPending ? (
          <p role="status">{t('apiState.loading')}</p>
        ) : isError && moderators.length === 0 ? (
          <UIQueryError retry={() => void refetch()} />
        ) : moderators.length === 0 ? (
          <UIEmpty>
            <p>{t('moderation.noModerators')}</p>
          </UIEmpty>
        ) : (
          <Virtuoso
            data={moderators}
            computeItemKey={(_, moderator) => moderator.userId}
            endReached={() => {
              if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
            }}
            components={listComponents}
            aria-label={t('moderation.moderators')}
            className="max-h-60 shrink-0 lg:max-h-none lg:min-h-0 lg:flex-1"
            itemContent={(_, moderator) => (
              <div
                role="listitem"
                className="flex items-center gap-4 border-b border-white-10 py-3 text-label"
              >
                <span className="min-w-0 flex-1 truncate">
                  {authorName(moderator) || t('apiState.student')}
                </span>
                <span className="shrink-0 text-detail text-secondary">
                  {t('moderation.grantedAt', {
                    date: formatDate.format(new Date(moderator.grantedAt)),
                  })}
                </span>
                <ConfirmActionButton
                  label={t('moderation.revoke')}
                  description={t('moderation.revokeDescription')}
                  success={t('moderation.revoked')}
                  onConfirm={() => revoke(moderator.userId)}
                />
              </div>
            )}
          />
        )}
      </section>
      <section className="flex min-h-0 flex-col gap-4">
        <h2 className="shrink-0 text-section font-semibold">{t('moderation.addModerator')}</h2>
        <ModeratorSearch />
      </section>
    </div>
  );
}
