import type { CourseCommentForm, CourseCommentsProps } from '@/@types';
// ai-design-check-ignore-file use-shared-components -- UIField and app-control are the established shared form pattern for react-hook-form in this project.
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useCourseComments, useAddCourseComment, useDeleteCourseComment } from '@/hooks';
import { courseCommentSchema } from '@/schemas';
import { captureAnalytics } from '@/utils/analytics';
import { UIButton, UIDialog, UIField, UIQueryError } from '@/ui/components';

export function CourseComments({ courseId }: CourseCommentsProps) {
  const { t, i18n } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useCourseComments(courseId);
  const { mutateAsync: add, isPending: isAdding } = useAddCourseComment();
  const { mutateAsync: remove, isPending: isDeleting } = useDeleteCourseComment();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseCommentForm>({
    resolver: zodResolver(courseCommentSchema),
    defaultValues: { content: '' },
  });
  const comments = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  async function submit(body: CourseCommentForm) {
    try {
      await add({ courseId, body });
      reset();
      toast.success(t('courses.commentAdded'));
    } catch {
      toast.error(t('apiState.error'));
    }
  }
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
      <ul className="divide-y divide-white-10">
        {comments.map((comment) => (
          <li key={comment.id} className="space-y-2 py-3">
            <div className="flex items-center justify-between gap-3">
              <time dateTime={comment.createdAt} className="text-detail text-secondary">
                {new Intl.DateTimeFormat(i18n.language, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(comment.createdAt))}
              </time>
              {comment.isMine && (
                <UIButton
                  size="pill"
                  bg="secondary"
                  onClick={() => setDeleteId(comment.id)}
                  data-ph-capture-attribute-label="Delete course comment"
                >
                  {t('app.remove')}
                </UIButton>
              )}
            </div>
            <p className="wrap-anywhere whitespace-pre-wrap">{comment.content}</p>
          </li>
        ))}
      </ul>
      {isError && <UIQueryError retry={() => void refetch()} />}
      {hasNextPage && !isError && (
        <UIButton
          size="sm"
          bg="secondary"
          disabled={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
          data-ph-capture-attribute-label="Load more course comments"
        >
          {t('apiState.loadMore')}
        </UIButton>
      )}
      <form
        className="space-y-3"
        onSubmit={handleSubmit(submit, () => captureAnalytics('course_comment_validation_failed'))}
      >
        <UIField
          label={t('courses.addComment')}
          error={errors.content ? t('courses.commentHint') : undefined}
        >
          <textarea
            className="app-control min-h-24 resize-y"
            maxLength={1000}
            disabled={isAdding}
            aria-invalid={Boolean(errors.content)}
            {...register('content')}
          />
        </UIField>
        <UIButton type="submit" disabled={isAdding}>
          {t('app.submit')}
        </UIButton>
      </form>
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
