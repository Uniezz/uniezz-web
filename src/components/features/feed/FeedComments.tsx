import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Skeleton } from 'skullet/react';
import type { FeedComment } from '@/@types';
import { useCommentReplies, useDeleteFeedComment, useMyProfile } from '@/hooks';
import { UIAvatar, UIButton, UIDialog, UIQueryError } from '@/ui/components';
import { authorName } from '@/utils/feed';
import { sampleComment } from '@/utils/feedSkeletonData';
import { FeedLikeButton } from './FeedLikeButton';
import { FeedCommentEditor } from './FeedCommentEditor';
import { ReportButton } from '@/components/features/reports/ReportButton';

export function FeedCommentItem({
  comment,
  onReply,
}: {
  comment: FeedComment;
  onReply: (comment: FeedComment) => void;
}) {
  const { t } = useTranslation();
  const href = useLocation({ select: (location) => location.href });
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const { data: profile } = useMyProfile();
  const { mutateAsync: deleteComment, isPending: isDeleting } = useDeleteFeedComment();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useCommentReplies(comment.id, expanded && comment.parentId === null);
  return (
    <article className="flex items-start gap-3 motion-safe:animate-rise-in">
      <UIAvatar size="md" imgSrc={comment.author?.avatarUrl ?? '/app/avatar.png'} alt="" />
      <div className="min-w-0 flex-1">
        <strong className="block text-label font-semibold">
          {!comment.deleted && comment.author ? (
            <Link
              to="/connections/students/$profileId"
              data-ph-capture-attribute-label="Open comment author profile"
              params={{ profileId: comment.author.id }}
              search={{ studentSearch: undefined, from: href }}
              className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-blue"
            >
              {authorName(comment.author) || t('apiState.student')}
            </Link>
          ) : comment.deleted ? (
            t('apiState.deletedComment')
          ) : (
            t('apiState.student')
          )}
        </strong>
        {editing ? (
          <FeedCommentEditor comment={comment} onClose={() => setEditing(false)} />
        ) : (
          !comment.deleted && (
            <p className="mt-1 text-label leading-relaxed wrap-anywhere whitespace-pre-wrap text-white-80">
              {comment.content}
            </p>
          )
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          {!comment.deleted && (
            <>
              <FeedLikeButton
                id={comment.id}
                kind="comment"
                liked={comment.likedByMe}
                count={comment.likesCount}
              />
              {comment.parentId === null && (
                <UIButton
                  bg="transparent"
                  size="pill"
                  className="min-h-0 border-0 p-0 enabled:hover:bg-transparent"
                  onClick={() => {
                    setExpanded(true);
                    onReply(comment);
                  }}
                >
                  {t('apiState.reply')}
                </UIButton>
              )}
              {profile?.id && profile.id === comment.author?.id && (
                <>
                  {!editing && (
                    <UIButton
                      bg="transparent"
                      size="pill"
                      className="min-h-0 border-0 p-0 enabled:hover:bg-transparent"
                      onClick={() => setEditing(true)}
                    >
                      {t('app.edit')}
                    </UIButton>
                  )}
                  <UIButton
                    bg="transparent"
                    size="pill"
                    className="min-h-0 border-0 p-0 text-danger enabled:hover:bg-transparent"
                    onClick={() => setConfirmDelete(true)}
                  >
                    {t('app.remove')}
                  </UIButton>
                </>
              )}
              {profile?.id && comment.author && profile.id !== comment.author.id && (
                <>
                  <ReportButton targetType="comment" targetId={comment.id} />
                </>
              )}
            </>
          )}
          {comment.parentId === null && comment.repliesCount > 0 && (
            <UIButton
              bg="transparent"
              size="pill"
              className="min-h-0 border-0 p-0 text-detail enabled:hover:bg-transparent"
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
            >
              <span className="grid">
                <span
                  className={
                    expanded ? 'invisible col-start-1 row-start-1' : 'col-start-1 row-start-1'
                  }
                  aria-hidden={expanded}
                >
                  {t('apiState.showReplies', { total: comment.repliesCount })}
                </span>
                <span
                  className={
                    expanded ? 'col-start-1 row-start-1' : 'invisible col-start-1 row-start-1'
                  }
                  aria-hidden={!expanded}
                >
                  {t('apiState.hideReplies')}
                </span>
              </span>
            </UIButton>
          )}
        </div>
        <UIDialog
          open={confirmDelete}
          onOpenChange={setConfirmDelete}
          title={t('apiState.deleteCommentTitle')}
          description={t('apiState.deleteCommentDescription')}
        >
          <div className="flex justify-end gap-3">
            <UIButton bg="secondary" disabled={isDeleting} onClick={() => setConfirmDelete(false)}>
              {t('postComposer.cancel')}
            </UIButton>
            <UIButton
              bg="danger"
              disabled={isDeleting}
              onClick={async () => {
                try {
                  await deleteComment(comment.id);
                  setConfirmDelete(false);
                  toast.success(t('apiState.commentDeleted'));
                } catch {
                  toast.error(t('apiState.error'));
                }
              }}
            >
              {t('app.remove')}
            </UIButton>
          </div>
        </UIDialog>
        {expanded && (
          <div className="mt-3 space-y-5">
            {isPending && <FeedCommentsSkeleton reply />}
            {data?.pages
              .flatMap((page) => page.items ?? [])
              .map((reply) => (
                <FeedCommentItem key={reply.id} comment={reply} onReply={onReply} />
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

export function FeedCommentsSkeleton({ reply = false }: { reply?: boolean }) {
  const { t } = useTranslation();
  return (
    <Skeleton loading label={t('apiState.loading')}>
      <div inert className="space-y-5">
        {[0, 1].map((index) => (
          <FeedCommentItem
            key={index}
            comment={{
              ...sampleComment,
              id: `skeleton-${index}`,
              parentId: reply ? 'skeleton' : null,
            }}
            onReply={() => {}}
          />
        ))}
      </div>
    </Skeleton>
  );
}
