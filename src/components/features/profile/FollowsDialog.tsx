import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import type { FollowList, StudentSummary } from '@/@types';
import { useFollowers, useFollowing, useUniversities } from '@/hooks';
import { UIDialog, UIQueryError, UISubTabs } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { StudentCard } from '@/components/features/connections';

type FollowsDialogProps = {
  profileId?: string;
  name: string;
  list: FollowList;
  onListChange: (list: FollowList) => void;
  onClose: () => void;
};

export function FollowsDialog({
  profileId,
  name,
  list,
  onListChange,
  onClose,
}: FollowsDialogProps) {
  const { t } = useTranslation();
  // The list grows with its content and scrolls with the dialog body.
  const [scrollParent, setScrollParent] = useState<HTMLDivElement | null>(null);

  return (
    <UIDialog
      placement="right"
      open
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      title={t(`follows.${list}`)}
      description={name}
    >
      <UISubTabs
        tabs={[
          { id: 'followers', label: t('follows.followers') },
          { id: 'following', label: t('follows.following') },
        ]}
        value={list}
        onChange={onListChange}
        label={name}
        idPrefix="follows"
        className="mb-4 shrink-0"
      />
      <div
        ref={setScrollParent}
        id="follows-tab-panel"
        role="tabpanel"
        aria-labelledby={`follows-tab-${list}`}
        // Opening a profile leaves this one, so the dialog closes behind the click.
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('a')) onClose();
        }}
        className="scrollbar-hidden -mx-6 min-h-0 flex-1 overflow-y-auto"
      >
        {scrollParent &&
          (list === 'followers' ? (
            <Followers profileId={profileId} scrollParent={scrollParent} />
          ) : (
            <Following profileId={profileId} scrollParent={scrollParent} />
          ))}
      </div>
    </UIDialog>
  );
}

type ListProps = { profileId?: string; scrollParent: HTMLDivElement };

function Followers({ profileId, scrollParent }: ListProps) {
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useFollowers(profileId);
  return (
    <StudentList
      students={data?.pages.flatMap((page) => page.items ?? []) ?? []}
      isPending={isPending}
      isError={isError}
      retry={() => void refetch()}
      loadMore={() => {
        if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
      }}
      scrollParent={scrollParent}
    />
  );
}

function Following({ profileId, scrollParent }: ListProps) {
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useFollowing(profileId);
  return (
    <StudentList
      students={data?.pages.flatMap((page) => page.items ?? []) ?? []}
      isPending={isPending}
      isError={isError}
      retry={() => void refetch()}
      loadMore={() => {
        if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
      }}
      scrollParent={scrollParent}
    />
  );
}

function StudentList({
  students,
  isPending,
  isError,
  retry,
  loadMore,
  scrollParent,
}: {
  students: StudentSummary[];
  isPending: boolean;
  isError: boolean;
  retry: () => void;
  loadMore: () => void;
  scrollParent: HTMLDivElement;
}) {
  const { t } = useTranslation();
  const { data: universities } = useUniversities();

  if (isPending)
    return (
      <p role="status" className="px-6">
        {t('apiState.loading')}
      </p>
    );
  if (isError) return <UIQueryError retry={retry} />;
  if (students.length === 0) return <p className="px-6 text-secondary">{t('follows.empty')}</p>;
  return (
    <Virtuoso
      customScrollParent={scrollParent}
      data={students}
      computeItemKey={(_, student) => student.id}
      endReached={loadMore}
      components={listComponents}
      itemContent={(_, student) => (
        <div role="listitem" className="border-b border-white-10">
          <StudentCard
            student={student}
            search=""
            university={universities?.find(({ id }) => id === student.universityId)?.name}
          />
        </div>
      )}
    />
  );
}
