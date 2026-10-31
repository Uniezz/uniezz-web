import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { FeedPost } from '@/@types';
import { UIPanel } from '@/ui/components';
import { cn } from '@/ui/cn';

export function FeedPostCard({ post, preview = false }: { post: FeedPost; preview?: boolean }) {
  const { t } = useTranslation();
  const isQuestion = post.type === 'question';
  return (
    <div className="group relative">
      <UIPanel className="overflow-hidden p-0">
        {post.image && !isQuestion && (
          <div className="h-50 overflow-hidden">
            <img
              src={post.image}
              alt=""
              className="size-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-105"
            />
          </div>
        )}
        <div className="min-w-0 p-5.5">
          <p
            className={cn(
              'text-label font-medium text-white-80',
              post.type !== 'post' && (!post.image || isQuestion) && 'pr-24',
            )}
          >
            {post.author}
          </p>
          <p className="mt-1 mb-3 text-detail text-secondary">
            {post.university} · {post.summary}
          </p>
          <h2 className="text-card-title font-semibold tracking-[-0.6px] wrap-anywhere">
            {post.title}
          </h2>
        </div>
      </UIPanel>
      {post.type !== 'post' && (
        <span className="app-tag pointer-events-none absolute top-3 right-5.5 z-20 border-white-20 bg-surface px-2 py-1">
          {isQuestion ? t('app.question') : t('app.event')}
        </span>
      )}
      {!preview && (
        <Link
          to="/feed/$postId"
          params={{ postId: post.id }}
          search={{ postId: post.id }}
          aria-label={`${t('app.viewPost')}: ${post.title}`}
          className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-2 focus-visible:outline-blue"
        />
      )}
    </div>
  );
}
