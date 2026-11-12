import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Bookmark, Heart } from 'lucide-react';
import { FeedPosts } from '@/components/features/feed/FeedPosts';
import { useMyProfile } from '@/hooks';
import type { FeedPostSource, ProfilePostsProps } from '@/@types';
import { UISegmented } from '@/ui/components';

const tabs = ['posts', 'liked', 'saved'] as const satisfies readonly FeedPostSource[];
const tabKeys = { posts: 'feed.posts', liked: 'feed.liked', saved: 'feed.saved' } as const;

export function ProfilePosts({ authorId, collections = true }: ProfilePostsProps) {
  const { t } = useTranslation();
  const { data: me } = useMyProfile();
  const showCollections = collections && me?.id === authorId;
  const [tab, setTab] = useState<FeedPostSource>('posts');
  return (
    <section className="space-y-4">
      {showCollections ? (
        <UISegmented
          label={t('feed.posts')}
          options={tabs.map((id) => t(tabKeys[id]))}
          value={t(tabKeys[tab])}
          onChange={(value) => setTab(tabs.find((id) => t(tabKeys[id]) === value) ?? 'posts')}
          icons={{
            [t(tabKeys.liked)]: <Heart className="size-4" aria-hidden="true" />,
            [t(tabKeys.saved)]: <Bookmark className="size-4" aria-hidden="true" />,
          }}
        />
      ) : (
        <h2 className="text-md font-bold">{t('feed.posts')}</h2>
      )}
      <FeedPosts
        search=""
        filters={!showCollections || tab === 'posts' ? { authorId } : undefined}
        source={showCollections ? tab : 'posts'}
      />
    </section>
  );
}
