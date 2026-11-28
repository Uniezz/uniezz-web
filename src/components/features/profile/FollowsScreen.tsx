import { useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { FollowList } from '@/@types';
import { StudentRow, StudentRowSkeletons } from '@/components/features/connections';
import {
  useEndReached,
  useFollowers,
  useFollowing,
  useMyProfile,
  usePublicProfile,
  useScrolledPast,
} from '@/hooks';
import { UICollapsingHeader, UIEmpty, UIQueryError, UISubTabs } from '@/ui/components';
import { authorName, HEADER_COMPACT_OFFSET } from '@/utils';

export type FollowsScreenProps = {
  /** Missing for the signed-in student's own lists. */
  profileId?: string;
  list: FollowList;
  onListChange: (list: FollowList) => void;
};

/** Phone-only: the mobile app's Follows screen, titled with the student's name. */
export function FollowsScreen({ profileId, list, onListChange }: FollowsScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const isCompact = useScrolledPast(HEADER_COMPACT_OFFSET);
  // both come from the cache of the profile that opened this screen
  const { data: me } = useMyProfile();
  const { data: student } = usePublicProfile(profileId ?? '', Boolean(profileId));
  const owner = profileId ? student : me;
  const title = (owner && authorName(owner)) || t(`follows.${list}`);
  const handleBack = () => router.history.back();
  return (
    <div data-hide-bottom-tabs className="-mx-4 -mt-6 px-4">
      <UICollapsingHeader
        title={title}
        isCompact={isCompact}
        onBack={handleBack}
        backLabel={t('app.back')}
      />
      <div className="flex flex-col pt-2 pb-10">
        {/* the app's tabs head the list and scroll with it */}
        <UISubTabs
          tabs={[
            { id: 'followers', label: t('follows.followers') },
            { id: 'following', label: t('follows.following') },
          ]}
          value={list}
          onChange={onListChange}
          label={title}
          idPrefix="follows"
          className="mb-3"
        />
        <div id="follows-tab-panel" role="tabpanel" aria-labelledby={`follows-tab-${list}`}>
          {list === 'followers' ? (
            <Followers profileId={profileId} />
          ) : (
            <Following profileId={profileId} />
          )}
        </div>
      </div>
    </div>
  );
}

function Followers({ profileId }: { profileId?: string }) {
  return <FollowsList query={useFollowers(profileId)} />;
}

function Following({ profileId }: { profileId?: string }) {
  return <FollowsList query={useFollowing(profileId)} />;
}

function FollowsList({
  query: { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage },
}: {
  query: ReturnType<typeof useFollowers>;
}) {
  const { t } = useTranslation();
  const students = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const endRef = useEndReached<HTMLDivElement>(() => {
    if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
  });
  const handleRetry = () => void refetch();
  if (isPending) return <StudentRowSkeletons count={6} />;
  if (isError && students.length === 0) return <UIQueryError retry={handleRetry} />;
  if (students.length === 0)
    return (
      // the cat centres on the screen as every empty state in the app
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <UIEmpty>
          <p>{t('follows.empty')}</p>
        </UIEmpty>
      </div>
    );
  return (
    <div className="flex flex-col gap-2.5">
      <ul className="flex flex-col gap-2.5">
        {students.map((student) => (
          <li key={student.id}>
            <StudentRow student={student} />
          </li>
        ))}
      </ul>
      {isFetchingNextPage && <StudentRowSkeletons count={1} />}
      <div ref={endRef} aria-hidden="true" />
    </div>
  );
}
