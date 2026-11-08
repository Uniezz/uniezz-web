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
        search: { ...search, feedRoute: 'new-post', postId: undefined, postFrom: undefined },
        replace: true,
      });
    }
  },
  component: NewPostPage,
});

function NewPostPage() {
  const { mutateAsync: createPost, isPending } = useCreatePost();
  const navigate = Route.useNavigate();
  // Replaces the composer's entry, so Back afterwards doesn't reopen it.
  const leave = (ignoreBlocker = false) =>
    void navigate({
      to: '/feed',
      search: { postId: undefined, postFrom: undefined, feedRoute: undefined },
      replace: true,
      ignoreBlocker,
    });
  const { t } = useTranslation();

  return (
    <PostComposer
      isPending={isPending}
      onCancel={() => leave()}
      onSubmit={async (values) => {
        await createPost(values);
        toast.success(t('postComposer.published'));
        leave(true);
      }}
    />
  );
}
