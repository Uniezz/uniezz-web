import { useTranslation } from 'react-i18next';
import type { FeedPost } from '@/@types';
import { UIAvatar } from '@/ui/components';
import { authorName } from '@/utils';

/** Compact post context pinned under the header once the full card has scrolled away. */
export function PostSummary({ post, onClick }: { post: FeedPost; onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      data-ph-capture-attribute-label="Scroll to post"
      className="flex w-full items-start gap-2.5 rounded-[14px] border border-white/12 bg-surface-60 px-3 py-2 text-left backdrop-blur-xl focus-visible:outline-2 focus-visible:outline-blue active:opacity-80"
    >
      <UIAvatar size="xs" imgSrc={post.author.avatarUrl ?? '/app/avatar.png'} alt="" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-micro font-semibold text-white-80">
          {authorName(post.author) || t('apiState.student')} ·{' '}
          {post.author.universityId.toUpperCase()}
        </span>
        <span className="line-clamp-2 text-detail font-semibold wrap-anywhere">{post.title}</span>
      </span>
    </button>
  );
}
