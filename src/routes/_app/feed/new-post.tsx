import { useContext } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { CreatePost } from '@/components/features/feed';
// TODO(api): Replace mock feed context and local submission with the create-post mutation.
import { FeedContext } from './route';

export const Route = createFileRoute('/_app/feed/new-post')({ component: NewPostPage });

function NewPostPage() {
  const context = useContext(FeedContext);
  const navigate = Route.useNavigate();
  const { t } = useTranslation();
  if (!context) return null;
  const backToFeed = () => {
    void navigate({ to: '/feed', search: { postId: undefined } });
  };

  return (
    <CreatePost
      onCancel={backToFeed}
      onCreate={(post) => {
        context.setPosts((posts) => [post, ...posts]);
        context.setSearch('');
        toast.success(t('postComposer.published'));
        backToFeed();
      }}
    />
  );
}
