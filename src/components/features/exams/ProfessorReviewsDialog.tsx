import type { ProfessorReviewsDialogProps } from '@/@types';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import { professorUrl, toast } from '@/utils';
import {
  useDeleteProfessorReview,
  useLeaveWhenGone,
  useProfessor,
  useProfessorReviews,
  useReviewProfessor,
} from '@/hooks';
import { courseCommentSchema } from '@/schemas';
import {
  UIButton,
  UICopyLink,
  UIDialog,
  UIDialogFooter,
  UIField,
  UIQueryError,
} from '@/ui/components';
import { listComponents } from '@/ui/virtuoso';
import { ReportButton } from '@/components/features/reports';

export function ProfessorReviewsDialog({ professorId, onClose }: ProfessorReviewsDialogProps) {
  const { t, i18n } = useTranslation();
  const { data: professor, error: professorError } = useProfessor(professorId);
  useLeaveWhenGone(professorError, t('share.professorGone'), onClose);
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useProfessorReviews(professorId);
  const { mutateAsync: saveReview, isPending: isSaving } = useReviewProfessor();
  const { mutateAsync: deleteReview, isPending: isDeleting } = useDeleteProfessorReview();
  const [content, setContent] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // The list grows with its content and scrolls with the dialog body instead of in a fixed box.
  const [scrollParent, setScrollParent] = useState<HTMLDivElement | null>(null);
  const reviews = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  // One review per student: once written, the form opens only to edit it.
  const hasMyReview = reviews.some(({ isMine }) => isMine);
  const showForm = !hasMyReview || isEditing;
  // Same rule as course comments: 1–1000 characters.
  const isValid = courseCommentSchema.safeParse({ content }).success;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = courseCommentSchema.safeParse({ content });
    if (!result.success || isSaving) return;
    try {
      await saveReview({ id: professorId, content: result.data.content });
      setContent('');
      setIsEditing(false);
      toast.success(t('professors.reviewSaved'));
    } catch {
      toast.error(t('apiState.error'));
    }
  }

  async function confirmDelete() {
    try {
      await deleteReview(professorId);
      setIsDeleteOpen(false);
      setIsEditing(false);
      setContent('');
      toast.success(t('professors.reviewDeleted'));
    } catch {
      toast.error(t('apiState.error'));
    }
  }

  return (
    <>
      <UIDialog
        placement="right"
        open
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
        title={t('professors.reviews')}
        description={
          professor
            ? [professor.degree, professor.name].filter(Boolean).join(' ')
            : t('apiState.loading')
        }
        footer={
          showForm && (
            // Pinned below the list so the form stays visible however long the list is.
            <UIDialogFooter className="block">
              <form onSubmit={submit} className="space-y-3">
                <UIField
                  label={t('professors.yourReview')}
                  hint={t('professors.reviewHint')}
                  maxLength={1000}
                  count={content.length}
                >
                  <textarea
                    className="app-control max-h-40 min-h-20 resize-y"
                    maxLength={1000}
                    disabled={isSaving}
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                  />
                </UIField>
                <div className="flex justify-end gap-3">
                  {isEditing && (
                    <UIButton
                      bg="secondary"
                      disabled={isSaving}
                      onClick={() => {
                        setIsEditing(false);
                        setContent('');
                      }}
                    >
                      {t('app.cancel')}
                    </UIButton>
                  )}
                  <UIButton type="submit" disabled={isSaving || !isValid}>
                    {t('app.submit')}
                  </UIButton>
                </div>
              </form>
            </UIDialogFooter>
          )
        }
      >
        <div
          ref={setScrollParent}
          className="scrollbar-hidden min-h-0 flex-1 space-y-6 overflow-y-auto"
        >
          <UICopyLink url={professorUrl(professorId)} analyticsLabel="Copy professor link" />
          {isPending && <p role="status">{t('apiState.loading')}</p>}
          {!isPending && !isError && reviews.length === 0 && (
            <p className="text-secondary">{t('professors.noReviews')}</p>
          )}
          {reviews.length > 0 && scrollParent && (
            <Virtuoso
              customScrollParent={scrollParent}
              data={reviews}
              computeItemKey={(_, review) => review.id}
              endReached={() => {
                if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
              }}
              components={listComponents}
              aria-label={t('professors.reviews')}
              itemContent={(_, review) => (
                <div role="listitem" className="pb-5">
                  <article className="min-w-0">
                    <p className="text-label leading-relaxed wrap-anywhere whitespace-pre-wrap text-white-80">
                      {review.content}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <time dateTime={review.updatedAt} className="text-detail text-secondary">
                        {new Intl.DateTimeFormat(i18n.language, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }).format(new Date(review.updatedAt))}
                      </time>
                      {review.isMine ? (
                        <>
                          {!isEditing && (
                            <UIButton
                              size="pill"
                              bg="transparent"
                              className="min-h-0 border-0 p-0 text-secondary enabled:hover:bg-transparent enabled:hover:text-white"
                              onClick={() => {
                                setContent(review.content);
                                setIsEditing(true);
                              }}
                              data-ph-capture-attribute-label="Edit professor review"
                            >
                              {t('professors.editReview')}
                            </UIButton>
                          )}
                          <UIButton
                            size="pill"
                            bg="transparent"
                            className="min-h-0 border-0 p-0 text-danger enabled:hover:bg-transparent"
                            onClick={() => setIsDeleteOpen(true)}
                            data-ph-capture-attribute-label="Delete professor review"
                          >
                            {t('app.remove')}
                          </UIButton>
                        </>
                      ) : (
                        <ReportButton targetType="professor_review" targetId={review.id} danger />
                      )}
                    </div>
                  </article>
                </div>
              )}
            />
          )}
          {isError && <UIQueryError retry={() => void refetch()} />}
        </div>
      </UIDialog>
      <UIDialog
        open={isDeleteOpen}
        onOpenChange={(open) => !open && setIsDeleteOpen(false)}
        dismissible={!isDeleting}
        title={t('professors.deleteReview')}
        description={t('professors.deleteReviewDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" disabled={isDeleting} onClick={() => setIsDeleteOpen(false)}>
            {t('app.cancel')}
          </UIButton>
          <UIButton bg="danger" disabled={isDeleting} onClick={() => void confirmDelete()}>
            {t('app.remove')}
          </UIButton>
        </div>
      </UIDialog>
    </>
  );
}
