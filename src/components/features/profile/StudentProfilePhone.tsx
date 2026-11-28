import { useFeatureFlagEnabled } from '@posthog/react';
import { Send } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PublicProfile } from '@/@types';
import { FeedPosts, PostCardSkeleton } from '@/components/features/feed';
import { useFeedPosts, useMyProfile, useOpenDirectChat } from '@/hooks';
import { UIButton } from '@/ui/components';
import { FollowButton } from './FollowButton';
import { ProfilePhoneHeader } from './OwnProfilePhone';
import { ProfilePhoneHero } from './ProfilePhoneHero';
import { ProfilePhotoStrip } from './ProfilePhotoStrip';
import { ProgrammeSummaryCard } from './ProgrammeSummaryCard';
import { StudentProfileMenu } from './StudentProfileMenu';

export type StudentProfilePhoneProps = { profile: PublicProfile };

/** The mobile app's student profile: a pushed screen without the bottom tabs. */
export function StudentProfilePhone({ profile }: StudentProfilePhoneProps) {
  const { t } = useTranslation();
  const { data: me } = useMyProfile();
  const isChatEnabled = useFeatureFlagEnabled('chat') === true;
  const { openChat, isPending: isOpeningChat } = useOpenDirectChat();
  const postFilters = useMemo(() => ({ authorId: profile.id }), [profile.id]);
  // the same query FeedPosts runs, so an empty list can say so as the app does
  const { data: posts, isPending: arePostsPending } = useFeedPosts(
    { ...postFilters, q: undefined },
    'posts',
  );
  // an error leaves it false, so FeedPosts shows the retry
  const arePostsEmpty = posts?.pages[0]?.items?.length === 0;
  const isMe = me?.id === profile.id;
  // the avatar alone adds nothing
  const photos = profile.photos && profile.photos.length > 1 ? profile.photos : [];
  const gender = profile.gender
    ? t(profile.gender === 'female' ? 'students.genderFemale' : 'students.genderMale')
    : undefined;
  const handleMessage = () => void openChat(profile.id);

  return (
    <div data-hide-bottom-tabs className="-mx-4 -mt-6 px-5">
      <ProfilePhoneHeader
        profile={profile}
        title={t('students.profile')}
        action={
          me &&
          !isMe && (
            <>
              {isChatEnabled && (
                <UIButton
                  size="square"
                  bg="glass"
                  aria-label={t('app.message')}
                  data-ph-capture-attribute-label="Message student"
                  disabled={isOpeningChat}
                  onClick={handleMessage}
                  className="size-11"
                >
                  <Send size={18} aria-hidden="true" />
                </UIButton>
              )}
              <StudentProfileMenu studentId={profile.id} />
            </>
          )
        }
      />
      <div className="flex flex-col gap-5 pb-15">
        <ProfilePhoneHero
          profile={profile}
          followAction={me && !isMe ? <FollowButton profile={profile} /> : undefined}
          detail={gender}
        />
        {photos.length > 0 && <ProfilePhotoStrip urls={photos} />}
        {profile.programmes && profile.programmes.length > 0 && (
          <section className="flex flex-col gap-3" aria-label={t('app.studyProgrammes')}>
            <h2 className="text-section font-semibold">{t('app.studyProgrammes')}</h2>
            {profile.programmes.map((programme, index) => (
              <ProgrammeSummaryCard key={index} programme={programme} />
            ))}
          </section>
        )}
        <section className="flex flex-col gap-4" aria-label={t('students.posts')}>
          <h2 className="text-section font-semibold">{t('students.posts')}</h2>
          {arePostsPending ? (
            <div className="flex flex-col gap-4">
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>
          ) : arePostsEmpty ? (
            <p className="text-secondary">{t('students.noPosts')}</p>
          ) : (
            <FeedPosts search="" filters={postFilters} source="posts" />
          )}
        </section>
      </div>
    </div>
  );
}
