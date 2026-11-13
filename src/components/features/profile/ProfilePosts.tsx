import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { FeedPosts } from '@/components/features/feed';
import { useMyProfile } from '@/hooks';
import type { FeedPostSource, ProfilePostsProps } from '@/@types';

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
        <div
          role="tablist"
          aria-label={t('feed.posts')}
          className="sticky top-0 z-30 -mx-4 flex gap-6 border-b border-white-10 bg-transparent px-4 pt-2 backdrop-blur-sm sm:-mx-7 sm:px-7 lg:-mx-10 lg:px-10"
        >
          {tabs.map((id) => {
            const selected = id === tab;
            return (
              <button
                key={id}
                id={`profile-posts-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="profile-posts-panel"
                tabIndex={selected ? 0 : -1}
                data-ph-capture-attribute-label={`View profile ${id}`}
                className={`flex-1 border-b-2 px-1 pb-3 text-center text-label font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue ${selected ? 'border-white text-white' : 'border-transparent text-secondary hover:text-white'}`}
                onClick={() => setTab(id)}
                onKeyDown={(event) => {
                  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
                  event.preventDefault();
                  const direction = event.key === 'ArrowRight' ? 1 : -1;
                  const next = tabs[(tabs.indexOf(id) + direction + tabs.length) % tabs.length];
                  setTab(next);
                  document.getElementById(`profile-posts-tab-${next}`)?.focus();
                }}
              >
                {t(tabKeys[id])}
              </button>
            );
          })}
        </div>
      ) : (
        <h2 className="text-md font-bold">{t('feed.posts')}</h2>
      )}
      <div
        id="profile-posts-panel"
        role={showCollections ? 'tabpanel' : undefined}
        aria-labelledby={showCollections ? `profile-posts-tab-${tab}` : undefined}
        tabIndex={showCollections ? 0 : undefined}
      >
        <FeedPosts
          search=""
          filters={!showCollections || tab === 'posts' ? { authorId } : undefined}
          source={showCollections ? tab : 'posts'}
        />
      </div>
    </section>
  );
}
