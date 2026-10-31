import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FeedComment } from '@/@types';
import { useCommentReplies } from '@/hooks';
import { UIAvatar, UIButton, UIQueryError } from '@/ui/components';
import { authorName } from '@/utils/feed';
import { FeedCommentsSkeleton } from './FeedCommentsSkeleton';

export function FeedCommentItem({ comment }: { comment: FeedComment }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useCommentReplies(comment.id, expanded && comment.parentId === null);
  return (
    <article className="flex items-start gap-3">
      <UIAvatar size="md" imgSrc={comment.author?.avatarUrl ?? '/app/avatar.png'} alt="" />
      <div className="min-w-0 flex-1">
        <strong className="block text-label font-semibold">
          {comment.deleted
            ? t('apiState.deletedComment')
            : authorName(comment.author) || t('apiState.student')}
        </strong>
        {!comment.deleted && (
          <p className="mt-1 text-label leading-relaxed wrap-anywhere whitespace-pre-wrap text-white-80">
            {comment.content}
          </p>
        )}
        {comment.parentId === null && comment.repliesCount > 0 && (
          <UIButton
            bg="transparent"
            size="pill"
            className="mt-2 px-0 text-detail"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {t(expanded ? 'apiState.hideReplies' : 'apiState.showReplies', {
              total: comment.repliesCount,
            })}
          </UIButton>
        )}
        {expanded && (
          <div className="mt-3 space-y-5">
            {isPending && <FeedCommentsSkeleton />}
            {data?.pages
              .flatMap((page) => page.items ?? [])
              .map((reply) => (
                <FeedCommentItem key={reply.id} comment={reply} />
              ))}
            {isError && <UIQueryError retry={() => void refetch()} />}
            {hasNextPage && (
              <UIButton
                bg="secondary"
                size="pill"
                disabled={isFetchingNextPage}
                onClick={() => void fetchNextPage()}
              >
                {t('apiState.loadMore')}
              </UIButton>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
