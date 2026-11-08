import { createFileRoute, Link, redirect, useLocation, useRouter } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Send, CornerUpLeft, X } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'skullet/react';
import toast from 'react-hot-toast';
import type { FeedComment } from '@/@types';
import { cn } from '@/ui/cn';
import { inputStyles } from '@/ui/components/UIInput/variants';
import { UIAvatar, UIButton, UIEmojiPicker, UIEmpty, UIPanel, UIQueryError } from '@/ui/components';
import {
  useFeedPostNavigation,
  useFeedPost,
  useFeedComments,
  useCreateComment,
  useMyProfile,
} from '@/hooks';
import { authorName, isAuthorProfilePath } from '@/utils/feed';
import { FeedCommentItem, FeedCommentsSkeleton } from '@/components/features/feed/FeedComments';
import { FeedLikeButton } from '@/components/features/feed/FeedLikeButton';
import { sampleComment, samplePost } from '@/utils/feedSkeletonData';
import { FeedPostActions } from '@/components/features/feed/FeedPostActions';
import { PostMedia } from '@/components/features/feed/PostMedia';
import { PostDetails } from '@/components/features/feed/PostDetails';
import { commentSchema } from '@/schemas';

export const Route = createFileRoute('/_app/feed/post/$postId')({
  beforeLoad: ({ params, search }) => {
    if (search.postId !== params.postId || search.feedRoute) {
      throw redirect({
        to: '/feed/post/$postId',
        params,
        search: { ...search, postId: params.postId, feedRoute: undefined },
        replace: true,
      });
    }
  },
  remountDeps: ({ params }) => params.postId,
  component: FeedPostPage,
});

function FeedPostPage() {
  const { postId } = Route.useParams();
  const { t } = useTranslation();
  const {
    data: loadedPost,
    isPending: isPostPending,
    isError: isPostError,
    refetch: refetchPost,
  } = useFeedPost(postId);
  const {
    data: navigation,
    isPending: isNavigationPending,
    isError: isNavigationError,
    refetch: refetchNavigation,
  } = useFeedPostNavigation(postId);
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
  const router = useRouter();
  const href = useLocation({ select: (location) => location.href });
  const { postFrom } = Route.useSearch();
  const { data: me } = useMyProfile();
  const [commentDraft, setCommentDraft] = useState('');
  const [replyTo, setReplyTo] = useState<FeedComment | null>(null);
  const [isCommentMultiline, setIsCommentMultiline] = useState(false);
  const post = loadedPost ?? (isPostPending ? samplePost : undefined);
  if (!post) {
    return (
      <div className="space-y-4">
        <Link
          to="/feed"
          search={{ postId: undefined, postFrom: undefined }}
          data-ph-capture-attribute-label={t('app.back')}
          className="inline-flex items-center gap-2 text-label text-secondary"
        >
          <ChevronLeft className="size-4" /> {t('app.back')}
        </Link>
        {isPostError ? <UIQueryError retry={() => void refetchPost()} /> : <UIEmpty />}
      </div>
    );
  }

  const previous = navigation?.previousId;
  const next = navigation?.nextId;
  const comments = isPostPending
    ? [sampleComment, { ...sampleComment, id: 'skeleton-2' }]
    : (commentData?.pages.flatMap((page) => page.items ?? []) ?? []);

  const sendComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = commentSchema.safeParse(commentDraft);
    if (!result.success || isCreatingComment) return;
    const replyToCommentId = replyTo?.id;
    try {
      await createComment({
        id: postId,
        content: result.data,
        replyToCommentId,
      });
      setCommentDraft('');
      setReplyTo(null);
      setIsCommentMultiline(false);
    } catch {
      toast.error(t('apiState.error'));
    }
  };

  const hasMedia = (post.mediaUrls?.length ?? 0) > 0;

  const author = (
    <>
      <UIAvatar size="md" imgSrc={post.author.avatarUrl ?? '/app/avatar.png'} alt="" />
      <p className="text-label font-medium text-white">
        {authorName(post.author) || t('apiState.student')}
      </p>
    </>
  );
  const postHeader = (
    <>
      <div className="flex items-center justify-between gap-3">
        {/* Opened from the author's profile: Back already returns there, a link would only loop. */}
        {isAuthorProfilePath(postFrom, post.author.id, me?.id) ? (
          <div className="flex w-fit items-center gap-3">{author}</div>
        ) : (
          <Link
            to="/connections/students/$profileId"
            data-ph-capture-attribute-label="Open post author profile"
            params={{ profileId: post.author.id }}
            search={{ studentSearch: undefined, from: href }}
            className="flex w-fit items-center gap-3 rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-blue"
          >
            {author}
          </Link>
        )}
        {post.type !== 'announcement' && (
          <span className="app-tag shrink-0 border-white-20 bg-surface px-2 py-1">
            {post.type === 'question' ? t('app.question') : t('app.event')}
          </span>
        )}
      </div>
      <PostDetails post={post} large={!hasMedia} />
    </>
  );
  const postActions = (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <FeedLikeButton id={post.id} kind="post" liked={post.likedByMe} count={post.likesCount} />
      <FeedPostActions post={post} />
    </div>
  );

  return (
    <Skeleton loading={isPostPending} label={t('apiState.loading')}>
      <div className="relative mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.history.push(postFrom ?? '/feed')}
          data-ph-capture-attribute-label={postFrom ? t('app.back') : t('feed.title')}
          className="mb-5 inline-flex min-h-11 items-center gap-2 px-2 py-2 text-label text-secondary transition-colors hover:text-white xl:absolute xl:top-0 xl:-left-32 xl:mb-0"
        >
          <ChevronLeft className="size-5" /> {postFrom ? t('app.back') : t('feed.title')}
        </button>
        <div inert={isPostPending} className="relative">
          <div className="grid min-w-0 items-stretch gap-5 md:h-[calc(100svh-9rem)] md:min-h-0 md:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] xl:h-[calc(100svh-56px)]">
            {hasMedia ? (
              <UIPanel className="overflow-hidden p-0">
                <PostMedia images={post.mediaUrls ?? []} />
              </UIPanel>
            ) : (
              <UIPanel
                surface="tint"
                className="flex min-h-0 flex-col gap-4 bg-ink/20 p-6 backdrop-blur-[48px] sm:p-8"
              >
                {postHeader}
              </UIPanel>
            )}
            <UIPanel
              surface="tint"
              className="flex min-h-0 min-w-0 flex-col bg-ink/20 p-0 backdrop-blur-[48px]"
            >
              <div className="max-h-[45%] shrink-0 space-y-3 overflow-y-auto border-b border-white-10 p-5.5 sm:p-6">
                {hasMedia && postHeader}
                {postActions}
              </div>
              <section aria-label={t('app.comments')} className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5.5 sm:p-6">
                  {areCommentsPending && !isPostPending && <FeedCommentsSkeleton />}
                  {comments.map((comment) => (
                    <FeedCommentItem key={comment.id} comment={comment} onReply={setReplyTo} />
                  ))}
                  {areCommentsError && <UIQueryError retry={() => void refetchComments()} />}
                  {hasMoreComments && (
                    <UIButton
                      bg="secondary"
                      size="pill"
                      disabled={isFetchingMoreComments}
                      onClick={() => void fetchMoreComments()}
                    >
                      {t('apiState.loadMore')}
                    </UIButton>
                  )}
                </div>
              </section>
              <form onSubmit={sendComment} className="shrink-0 border-t border-white-10 p-4 sm:p-5">
                {replyTo && (
                  <div className="mb-3 flex min-w-0 items-start gap-2 px-1">
                    <CornerUpLeft
                      className="mt-1 size-4 shrink-0 text-secondary"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1 text-detail leading-relaxed">
                      <p className="text-secondary">
                        {t('apiState.replyingTo', {
                          name: authorName(replyTo.author) || t('apiState.student'),
                        })}
                      </p>
                      <p className="max-h-20 overflow-y-auto wrap-anywhere whitespace-pre-wrap text-white-80">
                        {replyTo.content ?? t('apiState.deletedComment')}
                      </p>
                    </div>
                    <UIButton
                      bg="transparent"
                      size="icon"
                      className="-mt-1 shrink-0 border-0 text-secondary"
                      aria-label={t('postComposer.cancel')}
                      onClick={() => setReplyTo(null)}
                    >
                      <X size={18} aria-hidden="true" />
                    </UIButton>
                  </div>
                )}
                <div
                  className={cn(
                    inputStyles(),
                    'relative py-1 pr-12 focus-within:border-white-10',
                    isCommentMultiline ? 'rounded-2xl' : 'rounded-full',
                  )}
                >
                  <textarea
                    autoComplete="off"
                    value={commentDraft}
                    onChange={(event) => {
                      setCommentDraft(event.target.value);
                      setIsCommentMultiline(event.currentTarget.scrollHeight > 32);
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key === 'Enter' &&
                        !event.shiftKey &&
                        !event.nativeEvent.isComposing
                      ) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    rows={1}
                    maxLength={1000}
                    disabled={isCreatingComment}
                    aria-label={t('app.addComment')}
                    placeholder={t('app.addComment')}
                    className="field-sizing-content max-h-28 min-h-6 min-w-0 flex-1 resize-none bg-transparent p-0 text-label leading-6 text-white outline-none placeholder:text-secondary"
                  />
                  <UIEmojiPicker
                    disabled={isCreatingComment}
                    className={cn('-my-1 shrink-0', isCommentMultiline && 'self-end')}
                  />
                  {commentDraft.trim() && (
                    <UIButton
                      type="submit"
                      disabled={isCreatingComment}
                      size="icon"
                      bg="transparent"
                      aria-label={t('app.send')}
                      className={cn(
                        'absolute right-1.5 bottom-0 border-transparent enabled:hover:bg-transparent',
                      )}
                    >
                      <Send size={16} aria-hidden="true" />
                    </UIButton>
                  )}
                </div>
              </form>
            </UIPanel>
          </div>
          {isNavigationError && <UIQueryError retry={() => void refetchNavigation()} />}
          <nav
            aria-label={t('app.postNavigation')}
            className="pointer-events-none absolute inset-y-0 -right-32 -left-32 grid min-h-11 grid-cols-[8rem_minmax(0,1fr)_8rem] items-center max-xl:static max-xl:mt-5 max-xl:flex max-xl:justify-between"
          >
            {isNavigationPending ? (
              <>
                <Skeleton
                  loading
                  label={t('apiState.loading')}
                  className="col-start-1 row-start-1 size-11 justify-self-center"
                >
                  <UIButton
                    size="icon"
                    bg="secondary"
                    className="size-11"
                    aria-label={t('app.previousPost')}
                  >
                    <ChevronLeft className="size-5" />
                  </UIButton>
                </Skeleton>
                <Skeleton
                  loading
                  label={t('apiState.loading')}
                  className="col-start-3 row-start-1 size-11 justify-self-center"
                >
                  <UIButton
                    size="icon"
                    bg="secondary"
                    className="size-11"
                    aria-label={t('app.nextPost')}
                  >
                    <ChevronRight className="size-5" />
                  </UIButton>
                </Skeleton>
              </>
            ) : previous ? (
              <Link
                to="/feed/post/$postId"
                data-ph-capture-attribute-label={t('app.previousPost')}
                params={{ postId: previous }}
                search={{ postId: previous, postFrom }}
                aria-label={t('app.previousPost')}
                className="hover:bg-white-15 pointer-events-auto col-start-1 row-start-1 grid size-11 shrink-0 place-items-center justify-self-center rounded-full bg-white-10"
              >
                <ChevronLeft className="size-5" />
              </Link>
            ) : (
              <span skullet-ignore="" className="col-start-1 row-start-1" />
            )}
            {next && (
              <Link
                to="/feed/post/$postId"
                data-ph-capture-attribute-label={t('app.nextPost')}
                params={{ postId: next }}
                search={{ postId: next, postFrom }}
                aria-label={t('app.nextPost')}
                className="hover:bg-white-15 pointer-events-auto col-start-3 row-start-1 grid size-11 shrink-0 place-items-center justify-self-center rounded-full bg-white-10"
              >
                <ChevronRight className="size-5" />
              </Link>
            )}
            {!next && <span skullet-ignore="" className="col-start-3 row-start-1" />}
          </nav>
        </div>
      </div>
    </Skeleton>
  );
}
