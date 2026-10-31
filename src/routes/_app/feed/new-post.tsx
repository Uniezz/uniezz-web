import { useContext } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { CreatePost } from '@/components/features/feed';
// TODO(api): Replace mock feed context and local submission with the create-post mutation.
import { FeedContext } from './route';

export const Route = createFileRoute('/_app/feed/new-post')({
  beforeLoad: ({ search }) => {
    if (search.feedRoute !== 'new-post' || search.postId) {
      throw redirect({
        to: '/feed/new-post',
        search: { ...search, feedRoute: 'new-post', postId: undefined },
        replace: true,
      });
    }
  },
  component: NewPostPage,
});

function NewPostPage() {
  const context = useContext(FeedContext);
  const navigate = Route.useNavigate();
  const { t } = useTranslation();
  if (!context) return null;
  const backToFeed = () => {
    void navigate({ to: '/feed', search: { postId: undefined, feedRoute: undefined } });
  };

  return (
    <CreatePost
      onCancel={backToFeed}
      onCreate={(post) => {
        context.setPosts((posts) => [post, ...posts]);
        context.setSearch('');
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
