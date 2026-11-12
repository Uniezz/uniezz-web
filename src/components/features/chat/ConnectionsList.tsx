import { Link } from '@tanstack/react-router';
import { MatchActions } from '@/components/features/connections/MatchActions';
import { useTranslation } from 'react-i18next';
import { useConnectionsList, useUniversities } from '@/hooks';
import { Virtuoso } from 'react-virtuoso';
import { UIAvatar, UIEmpty, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { authorName } from '@/utils/feed';

export type ConnectionsListProps = {
  selected: string;
  onOpen: (id: string) => void;
};

export function ConnectionsList({ selected, onOpen }: ConnectionsListProps) {
  const { t, i18n } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useConnectionsList();
  const { data: universities = [] } = useUniversities();
  const connections = data?.pages.flatMap((page) => page.items ?? []) ?? [];

  if (!isPending && !isError && connections.length === 0) return <UIEmpty />;

  return (
    <>
      <Virtuoso
        data={connections}
        computeItemKey={(_, { id }) => id}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
        }}
        components={listComponents}
        aria-label={t('connections.title')}
        className="min-h-0 flex-1"
        itemContent={(_, { id, profile, mode, connectedAt }) => (
          <div role="listitem" className="pb-0.5">
            <button
              type="button"
              data-ph-capture-attribute-label="Open connection"
              onClick={() => onOpen(profile.id)}
              aria-current={selected === profile.id ? 'true' : undefined}
              className={`flex w-full items-center gap-3 rounded-2xl border border-transparent p-2.5 text-left transition-colors hover:bg-white-5 ${selected === profile.id ? 'border-white-10 bg-white-10' : ''}`}
            >
              <UIAvatar imgSrc={profile.avatarUrl ?? undefined} alt="" />
              <span className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-0.75">
                <strong className="truncate text-body font-semibold">{authorName(profile)}</strong>
                <span className="justify-self-end text-detail text-secondary">
                  {t('app.sayHi')}
                </span>
                <span className="block min-h-5 truncate text-label text-secondary">
                  {universities.find((university) => university.id === profile.universityId)?.name}
                </span>
              </span>
            </button>
            <div className="space-y-2 px-2.5 pb-3">
              <p className="text-detail text-secondary">
                {t(`app.${mode}`)} ·{' '}
                {new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' }).format(
                  new Date(connectedAt),
                )}
              </p>
              <Link
                to="/connections/students/$profileId"
                params={{ profileId: profile.id }}
                search={{ studentSearch: undefined }}
                data-ph-capture-attribute-label="Open matched profile"
                className="text-detail underline focus-visible:outline-2 focus-visible:outline-blue"
              >
                {t('connections.viewProfile')}
              </Link>
              <MatchActions connectionId={id} studentId={profile.id} />
            </div>
          </div>
        )}
      />
      {isError && <UIQueryError retry={() => void refetch()} />}
    </>
  );
}
