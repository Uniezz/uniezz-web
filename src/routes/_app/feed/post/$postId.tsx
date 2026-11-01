import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Send, CalendarDays } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'skullet/react';
import type { FeedComment } from '@/@types';

import { cn } from '@/ui/cn';
import { inputStyles } from '@/ui/components/UIInput/variants';
import { UIAvatar, UIButton, UIEmpty, UIPanel, UIQueryError } from '@/ui/components';
import { useFeedPosts, useFeedPost, useFeedComments, useCreateComment } from '@/hooks';
import { authorName, postDate } from '@/utils/feed';
import { FeedCommentItem, FeedCommentsSkeleton } from '@/components/features/feed/FeedComments';
import { FeedLikeButton } from '@/components/features/feed/FeedLikeButton';
import { sampleComment, samplePost } from '@/utils/feedSkeletonData';
import { FeedPostActions } from '@/components/features/feed/FeedPostActions';
import { PostMedia } from '@/components/features/feed/PostMedia';
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
  const { t, i18n } = useTranslation();
  const {
    data: loadedPost,
    isPending: isPostPending,
    isError: isPostError,
    refetch: refetchPost,
  } = useFeedPost(postId);
  const {
    data: feedData,
    isPending: isFeedPending,
    hasNextPage: hasMorePosts,
    isFetchingNextPage: isFetchingMorePosts,
    fetchNextPage: fetchMorePosts,
  } = useFeedPosts();
  const {
    data: commentData,
    isPending: areCommentsPending,
    isError: areCommentsError,
    refetch: refetchComments,
    hasNextPage: hasMoreComments,
    isFetchingNextPage: isFetchingMoreComments,
    fetchNextPage: fetchMoreComments,
  } = useFeedComments(postId);
  const {
    createComment,
    isPending: isCreatingComment,
    isError: createCommentError,
  } = useCreateComment();
  const feedPosts = feedData?.pages.flatMap((page) => page.items ?? []) ?? [];
  const [commentDraft, setCommentDraft] = useState('');
  const [replyTo, setReplyTo] = useState<FeedComment | null>(null);
  const [isCommentMultiline, setIsCommentMultiline] = useState(false);
  const index = feedPosts.findIndex((post) => post.id === postId);
  const post = loadedPost ?? (isPostPending ? samplePost : undefined);
  if (!post) {
    return (
      <div className="space-y-4">
        <Link
          to="/feed"
          search={{ postId: undefined }}
          className="inline-flex items-center gap-2 text-label text-secondary"
        >
          <ChevronLeft className="size-4" /> {t('app.back')}
        </Link>
        {isPostError ? <UIQueryError retry={() => void refetchPost()} /> : <UIEmpty />}
      </div>
    );
  }

  // shortcut: Adjacent navigation covers loaded feed pages until the API provides neighbours.
  const previous = index > 0 ? feedPosts[index - 1] : undefined;
  const next = index >= 0 ? feedPosts[index + 1] : undefined;
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
      /* Keep the comment draft on failure. */
    }
  };

  return (
    <Skeleton loading={isPostPending} label={t('apiState.loading')}>
      <div className="relative mx-auto max-w-5xl">
        <Link
          to="/feed"
          search={{ postId: undefined }}
          className="mb-5 inline-flex min-h-11 items-center gap-2 px-2 py-2 text-label text-secondary transition-colors hover:text-white xl:absolute xl:top-0 xl:-left-32 xl:mb-0"
        >
          <ChevronLeft className="size-5" /> {t('feed.title')}
        </Link>
        <div className="relative">
          <div className="grid min-w-0 items-stretch gap-5 md:h-[calc(100svh-9rem)] md:min-h-0 md:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] xl:h-[calc(100svh-56px)]">
            <UIPanel className="overflow-hidden p-0">
              <PostMedia images={post.mediaUrls ?? []} title={post.title} />
            </UIPanel>
            <UIPanel className="flex min-h-0 min-w-0 flex-col p-0">
              <div className="max-h-[45%] shrink-0 space-y-3 overflow-y-auto border-b border-white-10 p-5.5 sm:p-6">
                <Link
                  to="/profiles/$profileId"
                  params={{ profileId: post.author.id }}
                  search={{ studentSearch: undefined }}
                  className="inline-flex items-center gap-3 rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-blue"
                >
                  <UIAvatar size="md" imgSrc={post.author.avatarUrl ?? '/app/avatar.png'} alt="" />
                  <p className="text-label font-medium text-white">
                    {authorName(post.author) || t('apiState.student')}
                  </p>
                </Link>
                <h1 className="text-body font-semibold tracking-[-0.2px] wrap-anywhere">
                  {post.title}
                </h1>
                {post.type === 'event' && (
                  <div className="space-y-2 text-detail text-secondary">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
                      {postDate(post, i18n.resolvedLanguage ?? 'en')}
                    </p>
                  </div>
                )}
                {post.content && (
                  <p className="text-body wrap-anywhere whitespace-pre-wrap text-white-80">
                    {post.content}
                  </p>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="app-tag wrap-anywhere">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <FeedLikeButton
                  id={post.id}
                  kind="post"
                  liked={post.likedByMe}
                  count={post.likesCount}
                />
                <FeedPostActions post={post} />
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
                  <div className="mb-2 flex items-center justify-between text-detail text-secondary">
                    <span>
                      {t('apiState.replyingTo', {
                        name: authorName(replyTo.author) || t('apiState.student'),
                      })}
                    </span>
                    <UIButton bg="transparent" size="pill" onClick={() => setReplyTo(null)}>
                      {t('postComposer.cancel')}
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
                  {commentDraft.trim() && (
                    <UIButton
                      type="submit"
                      disabled={isCreatingComment}
                      size="icon"
                      bg="secondary"
                      leftIcon={Send}
                      aria-label={t('app.send')}
                      className={cn(
                        'absolute right-1.5 border-transparent',
                        isCommentMultiline ? 'bottom-1.5' : 'top-1/2 -translate-y-1/2',
                      )}
                    >
                      {''}
                    </UIButton>
                  )}
                </div>
                {createCommentError && <UIQueryError />}
              </form>
            </UIPanel>
          </div>
          <nav
            aria-label={t('app.postNavigation')}
            className="pointer-events-none absolute inset-y-0 -right-32 -left-32 grid min-h-11 grid-cols-[8rem_minmax(0,1fr)_8rem] items-center max-xl:static max-xl:mt-5 max-xl:flex max-xl:justify-between"
          >
            {isFeedPending ? (
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
                params={{ postId: previous.id }}
                search={{ postId: previous.id }}
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
                params={{ postId: next.id }}
                search={{ postId: next.id }}
                aria-label={t('app.nextPost')}
                className="hover:bg-white-15 pointer-events-auto col-start-3 row-start-1 grid size-11 shrink-0 place-items-center justify-self-center rounded-full bg-white-10"
              >
                <ChevronRight className="size-5" />
              </Link>
            )}
            {!next && hasMorePosts && index >= 0 ? (
              <UIButton
                bg="secondary"
                size="pill"
                className="pointer-events-auto col-start-3 row-start-1 justify-self-center"
                disabled={isFetchingMorePosts}
                onClick={() => void fetchMorePosts()}
              >
                {t('apiState.loadMore')}
              </UIButton>
            ) : (
              !next && <span skullet-ignore="" className="col-start-3 row-start-1" />
            )}
          </nav>
        </div>
      </div>
    </Skeleton>
  );
}
