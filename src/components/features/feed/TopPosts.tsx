import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useFeaturedFeedPosts } from '@/hooks';
import { UIQueryError } from '@/ui/components';
import { postDate } from '@/utils/feed';

export function TopPosts() {
  const { t, i18n } = useTranslation();
  const { data, isPending, isError, refetch } = useFeaturedFeedPosts();

  if (isPending) return <p role="status">{t('apiState.loading')}</p>;
  if (isError) return <UIQueryError retry={refetch} />;
  if (!data.items?.length) return null;

  return (
    <div className="mb-6 flex gap-3 overflow-x-auto">
      {data.items.map((post) => (
        <Link
          key={post.id}
          to="/feed/post/$postId"
          params={{ postId: post.id }}
          data-ph-capture-attribute-label="Open featured post"
          className="group relative h-47 min-w-36 flex-1 overflow-hidden rounded-story bg-surface text-left focus-visible:outline-2 focus-visible:outline-blue"
        >
          <img src={post.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />
          <span className="absolute inset-0 bg-linear-to-t from-ink-90 via-ink-0 to-ink-0" />
          {post.eventDate && (
            <span className="absolute top-2.5 left-2.5 rounded-full border border-white-20 bg-ink-40 px-2.25 py-1 text-micro font-bold backdrop-blur-[12px]">
              {postDate(
                { eventDate: post.eventDate, createdAt: post.eventDate },
                i18n.resolvedLanguage ?? 'en',
              )}
            </span>
          )}
          <span className="absolute right-3 bottom-3 left-3">
            <strong className="block text-label leading-[1.2]">{post.title}</strong>
            <span className="mt-1 block text-micro font-medium text-white-80">
              {post.university}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
