import { createFileRoute, redirect } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { PostComposer } from '@/components/features/feed/PostComposer';
import { useCreatePost } from '@/hooks/useCreatePost';

export const Route = createFileRoute('/_app/feed/post/new-post')({
  beforeLoad: ({ search }) => {
    if (search.feedRoute !== 'new-post' || search.postId) {
      throw redirect({
        to: '/feed/post/new-post',
        search: { ...search, feedRoute: 'new-post', postId: undefined },
        replace: true,
      });
    }
  },
  component: NewPostPage,
});

function NewPostPage() {
  const { mutateAsync: createPost, isPending, isError } = useCreatePost();
  const navigate = Route.useNavigate();
  const { t } = useTranslation();

  return (
    <PostComposer
      isPending={isPending}
      isError={isError}
      onCancel={() =>
        void navigate({ to: '/feed', search: { postId: undefined, feedRoute: undefined } })
      }
      onSubmit={async (values) => {
        await createPost(values);
        toast.success(t('postComposer.published'));
        void navigate({
          to: '/feed',
          search: { postId: undefined, feedRoute: undefined },
          ignoreBlocker: true,
        });
      }}
    />
  );
}
