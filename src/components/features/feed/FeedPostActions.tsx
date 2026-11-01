import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import type { FeedPost } from '@/@types';
import { useDeleteFeedPost, useMyProfile } from '@/hooks';
import { UIButton, UIDialog } from '@/ui/components';
import { ReportButton } from '@/components/features/reports/ReportButton';

export function FeedPostActions({ post }: { post: FeedPost }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: profile } = useMyProfile();
  const { mutateAsync: deletePost, isPending: isDeleting } = useDeleteFeedPost();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!profile) return null;
  if (profile.id !== post.author.id) {
    return (
      <div className="flex flex-wrap gap-4">
        <ReportButton targetType="post" targetId={post.id} />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <Link
          to="/feed/post/edit-post/$postId"
          params={{ postId: post.id }}
          search={{ postId: post.id, feedRoute: undefined }}
          className="text-label font-semibold text-white focus-visible:outline-2 focus-visible:outline-blue"
        >
          {t('app.edit')}
        </Link>
        <UIButton
          bg="transparent"
          size="pill"
          className="min-h-0 border-0 p-0 text-danger enabled:hover:bg-transparent"
          onClick={() => setConfirmDelete(true)}
        >
          {t('app.remove')}
        </UIButton>
      </div>
      <UIDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={t('apiState.deletePostTitle')}
        description={t('apiState.deletePostDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" disabled={isDeleting} onClick={() => setConfirmDelete(false)}>
            {t('postComposer.cancel')}
          </UIButton>
          <UIButton
            bg="danger"
            disabled={isDeleting}
            onClick={async () => {
              try {
                await deletePost(post.id);
                toast.success(t('apiState.postDeleted'));
                void navigate({ to: '/feed', search: { postId: undefined, feedRoute: undefined } });
              } catch {
                toast.error(t('apiState.error'));
              }
            }}
          >
            {t('app.remove')}
          </UIButton>
        </div>
      </UIDialog>
    </>
  );
}
