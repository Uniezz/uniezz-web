import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

// TODO(api): Replace these mock top posts and local filtering with API-backed feed data.
import { FEEDMOCKS, matchesSearch } from '@/utils';

export function TopPosts({ search }: { search: string }) {
  const { t } = useTranslation();
  const posts = FEEDMOCKS.feed.topPosts.filter((post) =>
    matchesSearch(search, post.title, post.university, post.summary),
  );

  return (
    <div className="mb-6 flex gap-3 overflow-x-auto" aria-label={t('app.today')}>
      {posts.map((post) => (
        <Link
          key={post.id}
          to="/feed/$postId"
          params={{ postId: post.id }}
          search={{ postId: post.id }}
          className="group relative h-47 min-w-36 flex-1 overflow-hidden rounded-story text-left focus-visible:outline-2 focus-visible:outline-blue"
        >
          <div className="absolute inset-0 overflow-hidden transition-transform duration-700 ease-out group-hover:scale-105">
            <img src={post.image} alt="" className="size-full object-cover" />
          </div>
          <span className="absolute inset-0 bg-linear-to-t from-ink-90 via-ink-0 to-ink-0" />
          <span
            className={`absolute top-2.5 left-2.5 rounded-full px-2.25 py-1 text-micro font-bold ${post.summary === 'Live now' ? 'bg-red' : 'border border-white-20 bg-ink-40 backdrop-blur-[12px]'}`}
          >
            {post.summary === 'Live now' ? t('app.liveNow') : post.summary}
          </span>
          <span className="absolute right-3 bottom-3 left-3">
            <strong className="block text-label leading-[1.2]">{post.title}</strong>
            <span className="mt-1 block text-micro font-medium text-white-80">
              ◉ {post.university}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
