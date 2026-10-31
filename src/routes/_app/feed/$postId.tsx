import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Send, CalendarDays, MapPin } from 'lucide-react';
import { type FormEvent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/ui/cn';
import { inputStyles } from '@/ui/components/UIInput/variants';
import { UIAvatar, UIButton, UIEmpty, UIPanel } from '@/ui/components';
import { FEEDMOCKS } from '@/utils';
import { FeedContext } from './route';

// TODO(api): Replace mock post details, comments, ordering, and local comment submission with API-backed feed data.
const mockPosts = [...FEEDMOCKS.feed.topPosts, ...FEEDMOCKS.feed.posts];

export const Route = createFileRoute('/_app/feed/$postId')({
  beforeLoad: ({ params, search }) => {
    if (search.postId !== params.postId) {
      throw redirect({
        to: '/feed/$postId',
        params,
        search: { ...search, postId: params.postId },
        replace: true,
      });
    }
  },
  component: FeedPostPage,
});

function FeedPostPage() {
  const { postId } = Route.useParams();
  const { t } = useTranslation();
  // TODO(api): Resolve created posts through the post query instead of local feed context.
  const context = useContext(FeedContext);
  const feedPosts = [...(context?.posts ?? []), ...mockPosts];
  const [commentDraft, setCommentDraft] = useState('');
  const [isCommentMultiline, setIsCommentMultiline] = useState(false);
  const [localComments, setLocalComments] = useState<
    Record<string, { id: string; author: string; text: string; avatar?: string }[]>
  >({});
  const index = feedPosts.findIndex((post) => post.id === postId);
  const post = feedPosts[index];

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
        <UIEmpty />
      </div>
    );
  }

  const previous = feedPosts[index - 1];
  const next = feedPosts[index + 1];
  const comments = [...post.comments, ...(localComments[post.id] ?? [])];

  const sendComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = commentDraft.trim();
    if (!text) return;

    setLocalComments((current) => ({
      ...current,
      [post.id]: [
        ...(current[post.id] ?? []),
        {
          id: `${post.id}-${Date.now()}`,
          author: FEEDMOCKS.currentUser.name,
          text,
        },
      ],
    }));
    setCommentDraft('');
    setIsCommentMultiline(false);
  };

  return (
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
            <div className="bg-ink-20 relative flex aspect-[4/3] items-center justify-center md:aspect-auto md:h-full">
              {'image' in post && post.image ? (
                <img src={post.image} alt="" className="absolute inset-0 size-full object-cover" />
              ) : (
                <div className="p-8 text-center">
                  <h1 className="text-body font-semibold tracking-[-0.2px] wrap-anywhere">
                    {post.title}
                  </h1>
                </div>
              )}
            </div>
          </UIPanel>
          <UIPanel className="flex min-h-0 min-w-0 flex-col p-0">
            <div className="space-y-3 border-b border-white-10 p-5.5 sm:p-6">
              <div className="flex items-center gap-3">
                <UIAvatar
                  size="md"
                  imgSrc={'avatar' in post && post.avatar ? post.avatar : '/app/avatar.png'}
                  alt=""
                />
                <p className="text-label font-medium text-white">{post.author}</p>
              </div>
              <h1 className="text-body font-semibold tracking-[-0.2px] wrap-anywhere">
                {post.title}
              </h1>
              {post.type === 'event' && (
                <div className="space-y-2 text-detail text-secondary">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
                    {post.summary}
                  </p>
                  {post.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4 shrink-0" aria-hidden="true" />
                      {post.location}
                    </p>
                  )}
                </div>
              )}
              {post.body && (
                <p className="text-body wrap-anywhere whitespace-pre-wrap text-white-80">
                  {post.body}
                </p>
              )}
            </div>
            <section aria-label={t('app.comments')} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5.5 sm:p-6">
                {comments.map((comment) => (
                  <article key={comment.id} className="flex items-start gap-3">
                    <UIAvatar size="md" imgSrc={comment.avatar ?? '/app/avatar.png'} alt="" />
                    <div className="min-w-0">
                      <strong className="block text-label font-semibold">{comment.author}</strong>
                      <p className="mt-1 text-label leading-relaxed wrap-anywhere whitespace-pre-wrap text-white-80">
                        {comment.text}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <form onSubmit={sendComment} className="border-t border-white-10 p-4 sm:p-5">
              <div
                className={cn(
                  inputStyles(),
                  'relative py-1 pr-12 focus-within:border-white-10',
                  isCommentMultiline ? 'rounded-2xl' : 'rounded-full',
                )}
              >
                <textarea
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
                  maxLength={4000}
                  aria-label={t('app.addComment')}
                  placeholder={t('app.addComment')}
                  className="field-sizing-content max-h-28 min-h-6 min-w-0 flex-1 resize-none bg-transparent p-0 text-label leading-6 text-white outline-none placeholder:text-secondary"
                />
                {commentDraft.trim() && (
                  <UIButton
                    type="submit"
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
            </form>
          </UIPanel>
        </div>
        <nav
          aria-label={t('app.postNavigation')}
          className="pointer-events-none absolute inset-y-0 -right-32 -left-32 grid grid-cols-[8rem_minmax(0,1fr)_8rem] items-center max-xl:static max-xl:mt-5 max-xl:flex max-xl:justify-between"
        >
          {previous ? (
            <Link
              to="/feed/$postId"
              params={{ postId: previous.id }}
              search={{ postId: previous.id }}
              aria-label={t('app.previousPost')}
              className="hover:bg-white-15 pointer-events-auto col-start-1 row-start-1 grid size-11 shrink-0 place-items-center justify-self-center rounded-full bg-white-10"
            >
              <ChevronLeft className="size-5" />
            </Link>
          ) : (
            <span className="col-start-1 row-start-1" />
          )}
          {next && (
            <Link
              to="/feed/$postId"
              params={{ postId: next.id }}
              search={{ postId: next.id }}
              aria-label={t('app.nextPost')}
              className="hover:bg-white-15 pointer-events-auto col-start-3 row-start-1 grid size-11 shrink-0 place-items-center justify-self-center rounded-full bg-white-10"
            >
              <ChevronRight className="size-5" />
            </Link>
          )}
          {!next && <span className="col-start-3 row-start-1" />}
        </nav>
      </div>
    </div>
  );
}
