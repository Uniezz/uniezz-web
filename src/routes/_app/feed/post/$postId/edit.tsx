import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import { PostComposer } from '@/components/features/feed/PostComposer';
import { useFeedPost, useMyProfile, useUpdateFeedPost } from '@/hooks';
import { UIDialog, UIEmpty, UIQueryError } from '@/ui/components';
import { postFormDefaults } from '@/utils/feed';

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
