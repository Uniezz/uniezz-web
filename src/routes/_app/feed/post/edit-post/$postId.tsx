import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'skullet/react';
import toast from 'react-hot-toast';

import { PostComposer } from '@/components/features/feed/PostComposer';
import { useFeedPost, useMyProfile, useUpdateFeedPost } from '@/hooks';
import { UIEmpty, UIQueryError } from '@/ui/components';
import { samplePost } from '@/utils/feedSkeletonData';
import { postFormDefaults } from '@/utils/feed';

export const Route = createFileRoute('/_app/feed/post/edit-post/$postId')({
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

  if (isLoadingPost || isLoadingProfile) {
    return (
      <Skeleton loading label={t('apiState.loading')}>
        <div inert>
          <PostComposer
            post={samplePost}
            isPending={false}
            onCancel={() => {}}
            onSubmit={async () => {}}
          />
        </div>
      </Skeleton>
    );
  }
  if (!post || !profile)
    return <UIQueryError retry={() => void (postError ? refetchPost() : refetchProfile())} />;
  if (profile.id !== post.author.id) return <UIEmpty />;

  function backToPost() {
    void navigate({
      to: '/feed/post/$postId',
      params: { postId },
      search: { postId, feedRoute: undefined },
    });
  }

  return (
    <PostComposer
      post={post}
      isPending={isPending}
      onCancel={backToPost}
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
        void navigate({
          to: '/feed/post/$postId',
          params: { postId },
          search: { postId, feedRoute: undefined },
          ignoreBlocker: true,
        });
      }}
    />
  );
}
