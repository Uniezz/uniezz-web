import { useState, type FormEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import toast from 'react-hot-toast';
import { useCourseComments, useAddCourseComment, useDeleteCourseComment } from '@/hooks';
import { courseCommentSchema } from '@/schemas';
import { UIButton, UIDialog, UIField, UIQueryError } from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';

type CourseCommentsProps = { courseId: string; actions: ReactNode };

export function CourseComments({ courseId, actions }: CourseCommentsProps) {
  const { t, i18n } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useCourseComments(courseId);
  const { mutateAsync: add, isPending: isAdding } = useAddCourseComment();
  const { mutateAsync: remove, isPending: isDeleting } = useDeleteCourseComment();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const isCommentValid = courseCommentSchema.safeParse({ content }).success;
  const comments = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = courseCommentSchema.safeParse({ content });
    if (!result.success || isAdding) return;
    try {
      await add({ courseId, body: result.data });
      setContent('');
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
      <form className="space-y-3" onSubmit={submit}>
        <UIField label={t('courses.addComment')}>
          <textarea
            className="app-control max-h-50 min-h-28 resize-y"
            maxLength={1000}
            disabled={isAdding}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </UIField>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
          <UIButton type="submit" disabled={isAdding || !isCommentValid}>
            {t('app.submit')}
          </UIButton>
        </div>
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
