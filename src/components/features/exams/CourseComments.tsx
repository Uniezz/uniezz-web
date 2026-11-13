import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import toast from 'react-hot-toast';
import { useCourseComments, useDeleteCourseComment } from '@/hooks';
import { UIButton, UIDialog, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';

export function CourseComments({ courseId }: { courseId: string }) {
  const { t, i18n } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useCourseComments(courseId);
  const { mutateAsync: remove, isPending: isDeleting } = useDeleteCourseComment();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const comments = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      setDeleteId(null);
      toast.success(t('courses.commentDeleted'));
    } catch {
      toast.error(t('apiState.error'));
    }
  }
  return (
    <section className="space-y-4" aria-label={t('app.comments')}>
      <h3 className="text-section font-semibold">{t('app.comments')}</h3>
      {isPending && <p role="status">{t('apiState.loading')}</p>}
      {!isPending && !isError && comments.length === 0 && (
        <p className="text-secondary">{t('courses.noComments')}</p>
      )}
      {comments.length > 0 && (
        <Virtuoso
          data={comments}
          computeItemKey={(_, comment) => comment.id}
          endReached={() => {
            if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
          }}
          components={listComponents}
          aria-label={t('app.comments')}
          className="scrollbar-gray"
          style={{ height: '16rem' }}
          itemContent={(_, comment) => (
            <div role="listitem" className="pb-5">
              <article className="min-w-0">
                <p className="text-label leading-relaxed wrap-anywhere whitespace-pre-wrap text-white-80">
                  {comment.content}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <time dateTime={comment.createdAt} className="text-detail text-secondary">
                    {new Intl.DateTimeFormat(i18n.language, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(comment.createdAt))}
                  </time>
                  {comment.isMine && (
                    <UIButton
                      size="pill"
                      bg="transparent"
                      className="min-h-0 border-0 p-0 text-danger enabled:hover:bg-transparent"
                      onClick={() => setDeleteId(comment.id)}
                      data-ph-capture-attribute-label="Delete course comment"
                    >
                      {t('app.remove')}
                    </UIButton>
                  )}
                </div>
              </article>
            </div>
          )}
        />
      )}
      {isError && <UIQueryError retry={() => void refetch()} />}
      <UIDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        dismissible={!isDeleting}
        title={t('courses.deleteComment')}
        description={t('courses.deleteCommentDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" disabled={isDeleting} onClick={() => setDeleteId(null)}>
            {t('app.cancel')}
          </UIButton>
          <UIButton bg="danger" disabled={isDeleting} onClick={() => void confirmDelete()}>
            {t('app.remove')}
          </UIButton>
        </div>
      </UIDialog>
    </section>
  );
}
