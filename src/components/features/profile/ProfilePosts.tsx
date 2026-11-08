import { useTranslation } from 'react-i18next';
import { FeedPosts } from '@/components/features/feed/FeedPosts';

export function ProfilePosts({ authorId }: { authorId: string }) {
  const { t } = useTranslation();
  return (
    <section className="mt-8 space-y-4">
      <h2 className="text-md font-bold">{t('feed.posts')}</h2>
      <FeedPosts search="" filters={{ authorId }} />
    </section>
  );
}
