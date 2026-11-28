import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toast } from '@/utils';
import { PostComposer } from '@/components/features/feed';
import { useCreatePost, useGoBack } from '@/hooks';

export const Route = createFileRoute('/_app/feed/post/new-post')({
  component: NewPostPage,
});

function NewPostPage() {
  const { mutateAsync: createPost, isPending } = useCreatePost();
  const goBack = useGoBack();
  // Back to the screen that opened the composer, so Back afterwards doesn't reopen it.
  const leave = (ignoreBlocker = false) =>
    goBack({ to: '/feed', search: { postFrom: undefined } }, ignoreBlocker);
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
