import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { PostComposer } from '@/components/features/feed';
import { useFeedPost, useMyProfile, usePhoneViewport, useUpdateFeedPost } from '@/hooks';
import { X } from 'lucide-react';
import { UIButton, UIDialog, UIEmpty, UIQueryError } from '@/ui/components';
import { postFormDefaults, toast } from '@/utils';

export const Route = createFileRoute('/_app/feed/post/$postId/edit')({
  remountDeps: ({ params }) => params.postId,
  component: EditPostPage,
});

function EditPostPage() {
  const { postId } = Route.useParams();
  const navigate = Route.useNavigate();
  const { t } = useTranslation();
  const {
    data: post,
    isPending: isLoadingPost,
    isError: postError,
    refetch: refetchPost,
  } = useFeedPost(postId);
  const { data: profile, isPending: isLoadingProfile, refetch: refetchProfile } = useMyProfile();
  const { mutateAsync: updatePost, isPending } = useUpdateFeedPost();
  const isPhone = usePhoneViewport();

  // Replaces the form's entry, so Back can't reopen it; retained `postFrom` keeps the post's Back.
  function backToPost(ignoreBlocker = false) {
    void navigate({
      to: '/feed/post/$postId',
      params: { postId },
      replace: true,
      ignoreBlocker,
    });
  }

  if (isLoadingPost || isLoadingProfile || !post || !profile || profile.id !== post.author.id) {
    const isLoading = isLoadingPost || isLoadingProfile;
    const retry = () => void (postError ? refetchPost() : refetchProfile());
    // On a phone, the mobile app's edit screen frame: its header over a placeholder or the error.
    if (isPhone) {
      return (
        <div>
          <span data-hide-bottom-tabs hidden />
          <header className="-mx-4 -mt-6 box-content flex h-11 items-center gap-2.5 px-5 pt-[calc(8px+env(safe-area-inset-top))] pb-3">
            <UIButton
              size="square"
              bg="glass"
              aria-label={t('app.close')}
              onClick={() => backToPost()}
              className="size-11 text-white-80"
            >
              <X size={18} aria-hidden="true" />
            </UIButton>
            <h1 className="min-w-0 flex-1 truncate text-section font-semibold">
              {t('apiState.editPost')}
            </h1>
            <button
              type="button"
              disabled
              data-ph-capture-attribute-label="Save post"
              className="h-11 shrink-0 rounded-xl border border-white-20 bg-white-40 px-4 text-body font-semibold text-ink"
            >
              {t('apiState.save')}
            </button>
          </header>
          <div className="mt-3 px-1">
            {isLoading ? (
              <div
                role="status"
                aria-label={t('apiState.loading')}
                className="h-45 rounded-2xl bg-white-10 motion-safe:animate-pulse"
              />
            ) : !post || !profile ? (
              <UIQueryError retry={retry} />
            ) : (
              <UIEmpty />
            )}
          </div>
        </div>
      );
    }
    return (
      <UIDialog
        open
        placement="right"
        onOpenChange={(open) => {
          if (!open) backToPost();
        }}
        title={t('apiState.editPost')}
        description={t('postComposer.subtitle')}
      >
        {isLoadingPost || isLoadingProfile ? (
          <p role="status">{t('apiState.loading')}</p>
        ) : !post || !profile ? (
          <UIQueryError retry={() => void (postError ? refetchPost() : refetchProfile())} />
        ) : (
          <UIEmpty />
        )}
      </UIDialog>
    );
  }

  return (
    <PostComposer
      post={post}
      isPending={isPending}
      onCancel={() => backToPost()}
      onSubmit={async (values) => {
        const original = postFormDefaults(post);
        await updatePost({
          id: postId,
          body: {
            title: values.title,
            content: values.body,
            tags: values.tags,
            ...(post.type === 'event' &&
            (values.date !== original.date || values.time !== original.time)
              ? { eventDate: new Date(`${values.date}T${values.time}`).toISOString() }
              : {}),
          },
        });
        toast.success(t('app.saved'));
        backToPost(true);
      }}
    />
  );
}
