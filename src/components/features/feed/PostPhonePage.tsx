import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { ArrowLeft, Flag, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import type { FeedComment, FeedFilters, FeedPostSource } from '@/@types';
import { ApiRequestError } from '@/api';
import { ReportButton } from '@/components/features/reports';
import {
  useCreateComment,
  useDeleteFeedPost,
  useFeedComments,
  useFeedPost,
  useFeedPosts,
  useLeaveWhenGone,
  useMyProfile,
  useUpdateFeedComment,
} from '@/hooks';
import { cn } from '@/ui/cn';
import { UIButton, UIDialog, UIEmpty, UIQueryError } from '@/ui/components';
import { commentSchema } from '@/schemas';
import {
  apiErrorKey,
  authorName,
  formatCompactNumber,
  isAuthorProfilePath,
  POST_PAGER_PREFETCH,
  POST_SWIPE_DISTANCE,
  toast,
} from '@/utils';
import { CommentComposer } from './CommentComposer';
import { CommentItem, CommentSkeletonRows } from './CommentItem';
import { PostCard } from './PostCard';
import { PostCardSkeleton } from './PostCardSkeleton';
import { PostSummary } from './PostSummary';

/** The mobile app's post screen on a phone: a stack screen with its own header, swipe between posts and a pinned composer. */
export function PostPhonePage({
  postId,
  postFrom,
  postFilters,
  postSource,
}: {
  postId: string;
  postFrom?: string;
  postFilters: FeedFilters;
  postSource: FeedPostSource;
}) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const navigate = useNavigate();
  const { data: me } = useMyProfile();
  const {
    data: post,
    isPending: isPostPending,
    isError: isPostError,
    error: postError,
    refetch: refetchPost,
  } = useFeedPost(postId);
  const {
    data: navigationPosts,
    hasNextPage: hasMorePosts,
    isFetchingNextPage: isFetchingMorePosts,
    fetchNextPage: fetchMorePosts,
  } = useFeedPosts(postFilters, postSource);
  const {
    data: commentData,
    isPending: areCommentsPending,
    isError: areCommentsError,
    refetch: refetchComments,
    hasNextPage: hasMoreComments,
    isFetchingNextPage: isFetchingMoreComments,
    fetchNextPage: fetchMoreComments,
  } = useFeedComments(postId);
  const { createComment, isPending: isCreatingComment } = useCreateComment();
  const { mutateAsync: updateComment, isPending: isUpdatingComment } = useUpdateFeedComment();
  const { mutateAsync: deletePost, isPending: isDeleting } = useDeleteFeedPost();
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState<FeedComment | null>(null);
  const [editing, setEditing] = useState<FeedComment | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  useLeaveWhenGone(
    postError,
    t('share.postGone'),
    () => void router.navigate({ to: '/feed', search: { postFrom: undefined }, replace: true }),
  );

  const ids =
    navigationPosts?.pages.flatMap((page) => page.items?.map((item) => item.id) ?? []) ?? [];
  const index = ids.indexOf(postId);
  const previousId = index > 0 ? ids[index - 1] : undefined;
  const nextId = index >= 0 ? ids[index + 1] : undefined;
  const isNearEnd = index >= 0 && index >= ids.length - POST_PAGER_PREFETCH;
  // as the app's pager: the next feed page loads a few posts before the end
  useEffect(() => {
    if (isNearEnd && hasMorePosts && !isFetchingMorePosts) void fetchMorePosts();
  }, [isNearEnd, hasMorePosts, isFetchingMorePosts, fetchMorePosts]);
  // the compact summary appears once the full card has scrolled away
  const hasPost = Boolean(post);
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(([entry]) => setIsCardVisible(entry.isIntersecting));
    observer.observe(card);
    return () => observer.disconnect();
  }, [hasPost]);

  const comments = commentData?.pages.flatMap((page) => page.items ?? []) ?? [];
  const isMine = Boolean(post && me && post.author.id === me.id);
  const banner = editing
    ? t('apiState.editComment')
    : replyTo
      ? t('apiState.replyingTo', { name: authorName(replyTo.author) || t('apiState.student') })
      : undefined;

  const goToPost = (id: string | undefined) => {
    if (!id) return;
    // in place, so Back still returns to the list
    void navigate({
      to: '/feed/post/$postId',
      params: { postId: id },
      search: { postFrom, postFilters, postSource },
      replace: true,
    });
  };
  const handleBack = () => void router.navigate({ href: postFrom ?? '/feed' });
  const handleEditPost = () => void navigate({ to: '/feed/post/$postId/edit', params: { postId } });
  const handleDeleteOpen = () => setConfirmDelete(true);
  const handleDeleteClose = () => setConfirmDelete(false);
  const removePost = async () => {
    try {
      await deletePost(postId);
      toast.success(t('apiState.postDeleted'));
      // Replace the deleted post's entry, so Back can't reopen it.
      await router.navigate({ href: postFrom ?? '/feed', replace: true });
    } catch {
      toast.error(t('apiState.error'));
    }
  };
  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    const ignore = (event.target as HTMLElement).closest(
      '[data-swipe-ignore], form, [role=dialog]',
    );
    swipeStart.current = touch && !ignore ? { x: touch.clientX, y: touch.clientY } : null;
  };
  const handleTouchEnd = (event: TouchEvent) => {
    const start = swipeStart.current;
    const touch = event.changedTouches[0];
    swipeStart.current = null;
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < POST_SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    goToPost(dx < 0 ? nextId : previousId);
  };
  // dragging the list closes the keyboard, as the app's keyboardDismissMode="on-drag"
  const handleTouchMove = () => {
    if (document.activeElement === inputRef.current) inputRef.current?.blur();
  };
  const handleReply = (comment: FeedComment) => {
    setEditing(null);
    setReplyTo(comment);
    inputRef.current?.focus();
  };
  const handleEdit = (comment: FeedComment) => {
    setReplyTo(null);
    setEditing(comment);
    setDraft(comment.content ?? '');
    inputRef.current?.focus();
  };
  const handleCancel = () => {
    if (editing) setDraft('');
    setEditing(null);
    setReplyTo(null);
  };
  const handleSend = () => void sendComment();
  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const sendComment = async () => {
    const result = commentSchema.safeParse(draft);
    if (!result.success) return;
    try {
      if (editing) {
        await updateComment({ id: editing.id, content: result.data });
        toast.success(t('app.saved'));
      } else {
        await createComment({ id: postId, content: result.data, replyToCommentId: replyTo?.id });
        toast.success(t('apiState.commentSent'));
      }
      setDraft('');
      setReplyTo(null);
      setEditing(null);
    } catch (error) {
      const limited = error instanceof ApiRequestError && error.status === 429;
      toast.error(t(limited ? 'apiState.commentRateLimit' : apiErrorKey(error)));
    }
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove}>
      <span data-hide-bottom-tabs hidden />
      <header className="scroll-blur sticky top-0 z-30 -mx-4 -mt-6 mb-3 px-4 pt-[calc(8px+env(safe-area-inset-top))]">
        <div className="flex h-11 items-center gap-2.5">
          <UIButton size="square" bg="glass" aria-label={t('app.back')} onClick={handleBack}>
            <ArrowLeft size={18} aria-hidden="true" />
          </UIButton>
          <h1 className="min-w-0 flex-1 truncate text-section font-semibold">
            {t('postComposer.post')}
          </h1>
          {/* the app offers previous/next to screen readers as actions on the title */}
          {previousId && (
            <Link
              to="/feed/post/$postId"
              params={{ postId: previousId }}
              search={{ postFrom, postFilters, postSource }}
              replace
              className="sr-only"
              data-ph-capture-attribute-label={t('app.previousPost')}
            >
              {t('app.previousPost')}
            </Link>
          )}
          {nextId && (
            <Link
              to="/feed/post/$postId"
              params={{ postId: nextId }}
              search={{ postFrom, postFilters, postSource }}
              replace
              className="sr-only"
              data-ph-capture-attribute-label={t('app.nextPost')}
            >
              {t('app.nextPost')}
            </Link>
          )}
          {post && isMine && (
            <>
              <UIButton
                size="square"
                bg="glass"
                aria-label={t('apiState.editPost')}
                onClick={handleEditPost}
              >
                <Pencil size={18} aria-hidden="true" />
              </UIButton>
              <UIButton
                size="square"
                bg="glass"
                aria-label={t('app.remove')}
                disabled={isDeleting}
                onClick={handleDeleteOpen}
              >
                <Trash2 size={18} aria-hidden="true" />
              </UIButton>
            </>
          )}
          {post && me && !isMine && (
            <ReportButton
              targetType="post"
              targetId={post.id}
              renderTrigger={({ label, onOpen }) => (
                <UIButton size="square" bg="glass" aria-label={label} onClick={onOpen}>
                  <Flag size={18} aria-hidden="true" />
                </UIButton>
              )}
            />
          )}
        </div>
        {post && (
          <div
            aria-hidden={isCardVisible}
            className={cn(
              'absolute inset-x-4 top-full motion-safe:transition-[opacity,translate] motion-safe:duration-200 sm:inset-x-7',
              isCardVisible && 'pointer-events-none -translate-y-2 opacity-0',
            )}
          >
            <PostSummary post={post} onClick={handleScrollTop} />
          </div>
        )}
      </header>
      {post ? (
        <div ref={cardRef}>
          <PostCard
            post={post}
            isAuthorDisabled={isAuthorProfilePath(postFrom, post.author.id, me?.id)}
          />
        </div>
      ) : isPostPending ? (
        <PostCardSkeleton />
      ) : isPostError ? (
        <div className="flex justify-center text-center">
          <UIQueryError retry={() => void refetchPost()} />
        </div>
      ) : (
        <UIEmpty />
      )}
      {post && (
        <section aria-label={t('app.comments')} className="mt-4">
          <h2 className="flex items-baseline gap-2 text-md font-semibold tracking-[-0.4px]">
            {t('app.comments')}
            <span className="text-detail font-normal tracking-normal text-secondary">
              {formatCompactNumber(post.commentsCount, i18n.resolvedLanguage)}
            </span>
          </h2>
          {areCommentsPending ? (
            <CommentSkeletonRows count={4} />
          ) : areCommentsError ? (
            <div className="flex justify-center text-center">
              <UIQueryError retry={() => void refetchComments()} />
            </div>
          ) : comments.length === 0 ? (
            <UIEmpty />
          ) : (
            <Virtuoso
              data={comments}
              useWindowScroll
              computeItemKey={(_, comment) => comment.id}
              endReached={() => {
                if (hasMoreComments && !isFetchingMoreComments) void fetchMoreComments();
              }}
              aria-label={t('app.comments')}
              itemContent={(_, comment) => (
                <CommentItem comment={comment} onReply={handleReply} onEdit={handleEdit} />
              )}
            />
          )}
          {isFetchingMoreComments && <CommentSkeletonRows count={1} />}
        </section>
      )}
      {post && (
        <CommentComposer
          value={draft}
          onChange={setDraft}
          onSubmit={handleSend}
          isSending={isCreatingComment || isUpdatingComment}
          canSend={commentSchema.safeParse(draft).success}
          banner={banner}
          onCancel={handleCancel}
          inputRef={inputRef}
        />
      )}
      <UIDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        placement="bottom"
        title={t('apiState.deletePostTitle')}
        description={t('apiState.deletePostDescription')}
      >
        <div className="flex flex-col-reverse gap-3">
          <UIButton bg="secondary" disabled={isDeleting} onClick={handleDeleteClose}>
            {t('postComposer.cancel')}
          </UIButton>
          <UIButton bg="danger" disabled={isDeleting} onClick={removePost}>
            {t('app.remove')}
          </UIButton>
        </div>
      </UIDialog>
    </div>
  );
}
