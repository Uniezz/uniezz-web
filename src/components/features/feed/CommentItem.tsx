import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { FeedComment } from '@/@types';
import { useCommentReplies, useDeleteFeedComment, useMyProfile } from '@/hooks';
import { cn } from '@/ui/cn';
import { UIAvatar, UIButton, UIDialog, UIUniversityLogo } from '@/ui/components';
import { authorName, postDate, toast } from '@/utils';
import { ReportButton } from '@/components/features/reports';
import { FeedLikeButton } from './FeedLikeButton';

const actionClass =
  'min-h-0 border-0 p-0 text-detail font-semibold text-secondary enabled:hover:bg-transparent';

/** The mobile app's comment row on a phone: replies run as full rows under it, indented past the avatar. */
export function CommentItem({
  comment,
  onReply,
  onEdit,
}: {
  comment: FeedComment;
  onReply: (comment: FeedComment) => void;
  onEdit: (comment: FeedComment) => void;
}) {
  const { t, i18n } = useTranslation();
  const href = useLocation({ select: (location) => location.href });
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data: profile } = useMyProfile();
  const { mutateAsync: deleteComment, isPending: isDeleting } = useDeleteFeedComment();
  const isTopLevel = comment.parentId === null;
  const isMine = Boolean(profile?.id && comment.author?.id === profile.id);
  const { data: replies } = useCommentReplies(comment.id, expanded && isTopLevel);
  const name = authorName(comment.author) || t('apiState.student');

  const removeComment = async () => {
    try {
      await deleteComment(comment.id);
      setConfirmDelete(false);
      toast.success(t('apiState.commentDeleted'));
    } catch {
      toast.error(t('apiState.error'));
    }
  };
  const handleReply = () => onReply(comment);
  const handleEdit = () => onEdit(comment);
  const handleToggleReplies = () => setExpanded(!expanded);
  const handleDeleteOpen = () => setConfirmDelete(true);
  const handleDeleteClose = () => setConfirmDelete(false);

  const avatar = (
    <UIAvatar
      size={isTopLevel ? 'mobileSm' : 'xs'}
      imgSrc={comment.author?.avatarUrl ?? '/app/avatar.png'}
      alt=""
    />
  );
  const nameLine = (
    <>
      <span className="min-w-0 truncate text-label font-semibold">{name}</span>
      {comment.author && <UIUniversityLogo universityId={comment.author.universityId} size="xs" />}
      <span className="shrink-0 text-micro text-secondary">
        ·{' '}
        {postDate({ eventDate: null, createdAt: comment.createdAt }, i18n.resolvedLanguage ?? 'en')}
      </span>
    </>
  );
  const profileLink = comment.author && {
    to: '/connections/students/$profileId' as const,
    params: { profileId: comment.author.id },
    search: { studentSearch: undefined, from: href },
  };

  return (
    <div>
      <article className="flex items-start gap-2.5 px-1 py-2.25">
        {profileLink ? (
          <Link
            {...profileLink}
            aria-label={name}
            data-ph-capture-attribute-label="Open comment author profile"
            className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-blue"
          >
            {avatar}
          </Link>
        ) : (
          avatar
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {profileLink ? (
            <Link
              {...profileLink}
              aria-label={name}
              data-ph-capture-attribute-label="Open comment author profile"
              className="flex min-w-0 items-center gap-1.5 rounded-sm focus-visible:outline-2 focus-visible:outline-blue"
            >
              {nameLine}
            </Link>
          ) : (
            <div className="flex min-w-0 items-center gap-1.5">{nameLine}</div>
          )}
          <p
            className={cn(
              'text-body leading-[21px] wrap-anywhere whitespace-pre-wrap',
              comment.deleted ? 'text-secondary' : 'text-white-80',
            )}
          >
            {comment.deleted ? t('apiState.deletedComment') : comment.content}
          </p>
          {!comment.deleted && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <FeedLikeButton
                id={comment.id}
                kind="comment"
                liked={comment.likedByMe}
                count={comment.likesCount}
              />
              {isTopLevel && (
                <UIButton
                  bg="transparent"
                  size="pill"
                  className={actionClass}
                  onClick={handleReply}
                >
                  {t('apiState.reply')}
                </UIButton>
              )}
              {isMine ? (
                <>
                  <UIButton
                    bg="transparent"
                    size="pill"
                    className={actionClass}
                    onClick={handleEdit}
                  >
                    {t('app.edit')}
                  </UIButton>
                  <UIButton
                    bg="transparent"
                    size="pill"
                    className={cn(actionClass, 'text-red')}
                    onClick={handleDeleteOpen}
                  >
                    {t('app.remove')}
                  </UIButton>
                </>
              ) : (
                <ReportButton
                  targetType="comment"
                  targetId={comment.id}
                  renderTrigger={({ label, onOpen }) => (
                    <UIButton
                      bg="transparent"
                      size="pill"
                      aria-label={label}
                      className={actionClass}
                      onClick={onOpen}
                    >
                      {t('report.action')}
                    </UIButton>
                  )}
                />
              )}
            </div>
          )}
          {isTopLevel && comment.repliesCount > 0 && (
            <UIButton
              bg="transparent"
              size="pill"
              aria-expanded={expanded}
              className={cn(actionClass, 'self-start text-sky')}
              onClick={handleToggleReplies}
            >
              {expanded
                ? t('apiState.hideReplies')
                : t('apiState.showReplies', { total: comment.repliesCount })}
            </UIButton>
          )}
        </div>
      </article>
      {expanded && (
        <div className="pl-10.5">
          {replies?.pages
            .flatMap((page) => page.items ?? [])
            .map((reply) => (
              <CommentItem key={reply.id} comment={reply} onReply={onReply} onEdit={onEdit} />
            ))}
        </div>
      )}
      <UIDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        placement="bottom"
        title={t('apiState.deleteCommentTitle')}
        description={t('apiState.deleteCommentDescription')}
      >
        <div className="flex flex-col-reverse gap-3">
          <UIButton bg="secondary" disabled={isDeleting} onClick={handleDeleteClose}>
            {t('postComposer.cancel')}
          </UIButton>
          <UIButton bg="danger" disabled={isDeleting} onClick={removeComment}>
            {t('app.remove')}
          </UIButton>
        </div>
      </UIDialog>
    </div>
  );
}

/** Placeholder comment rows, as the mobile app's UISkeletonRow. */
export function CommentSkeletonRows({ count }: { count: number }) {
  const { t } = useTranslation();
  return (
    <div role="status" aria-label={t('apiState.loading')}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-start gap-2.5 px-1 py-2.25">
          <span className="size-8 shrink-0 rounded-full bg-white-10 motion-safe:animate-pulse" />
          <span className="flex flex-1 flex-col gap-2 pt-1">
            <span className="h-3 w-1/3 rounded-md bg-white-10 motion-safe:animate-pulse" />
            <span className="h-3 w-4/5 rounded-md bg-white-10 motion-safe:animate-pulse" />
          </span>
        </div>
      ))}
    </div>
  );
}
