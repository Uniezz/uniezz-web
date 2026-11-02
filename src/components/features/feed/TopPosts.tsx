import { useTranslation } from 'react-i18next';

import { matchesSearch } from '@/utils';

// TODO(api): Replace with the featured posts endpoint when the backend provides one.
const topPosts = [
  {
    id: 'coffee-code-meetup',
    title: 'Coffee & code meetup',
    university: 'Politechnika',
    summary: 'Live now',
    image: '/app/b4YP8L-0.jpg',
  },
  {
    id: 'rowing-club-open-day',
    title: 'Rowing club open day',
    university: 'UMCS',
    summary: '13:00',
    image: '/app/b4YP8L-1.jpg',
  },
  {
    id: 'bread-baking-workshop',
    title: 'Bread baking workshop',
    university: 'Przyrodniczy',
    summary: '16:30',
    image: '/app/b4YP8L-2.jpg',
  },
  {
    id: 'erasmus-language-cafe',
    title: 'Erasmus language café',
    university: 'WSEI',
    summary: '18:00',
    image: '/app/b4YP8L-3.jpg',
  },
  {
    id: 'autumn-welcome-party',
    title: 'Autumn Welcome Party',
    university: 'Politechnika',
    summary: 'Tonight, 20:00',
    image: '/app/b4YP8L-4.jpg',
  },
];

export function TopPosts({ search }: { search: string }) {
  const { t } = useTranslation();
  const posts = topPosts.filter((post) =>
    matchesSearch(search, post.title, post.university, post.summary),
  );

  return (
    <div className="mb-6 flex gap-3 overflow-x-auto" aria-label={t('app.today')}>
      {posts.map((post) => (
        <article
          key={post.id}
          className="group relative h-47 min-w-36 flex-1 overflow-hidden rounded-story text-left"
        >
          <img
            src={post.image}
            alt=""
            className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
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
        </article>
      ))}
    </div>
  );
}
