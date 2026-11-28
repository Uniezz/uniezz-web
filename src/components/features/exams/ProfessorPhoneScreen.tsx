import { useState, type FormEvent, type UIEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProfessorReviewsDialogProps } from '@/@types';
import {
  useDeleteProfessorReview,
  useEndReached,
  useLeaveWhenGone,
  useProfessor,
  useProfessorReviews,
  useReviewProfessor,
} from '@/hooks';
import { courseCommentSchema } from '@/schemas';
import { UIButton, UICollapsingHeader, UIDialog, UIQueryError } from '@/ui/components';
import { apiErrorKey, toast } from '@/utils';
import { ReportButton } from '@/components/features/reports';
import { ProfessorPhoneRow } from './ProfessorPhoneRow';
import { StudyRowSkeleton } from './StudyRowSkeleton';
import { StudySkeletonText } from './StudySkeletonText';

// as the mobile app's collapsing headers: compact once scrolled past this
const HEADER_COMPACT_OFFSET = 24;

/** The mobile app's professor screen: the professor's card, anonymous reviews, your review pinned below. */
export function ProfessorPhoneScreen({ professorId, onClose }: ProfessorReviewsDialogProps) {
  const { t, i18n } = useTranslation();
  const { data: professor, isPending, isError, error, refetch } = useProfessor(professorId);
  useLeaveWhenGone(error, t('share.professorGone'), onClose);
  const {
    data,
    isPending: areReviewsPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useProfessorReviews(professorId);
  const { mutateAsync: deleteReview, isPending: isDeleting } = useDeleteProfessorReview();
  const [isCompact, setIsCompact] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const reviews = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const myReview = reviews.find(({ isMine }) => isMine);
  const endRef = useEndReached<HTMLDivElement>(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  });
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const handleScroll = (event: UIEvent<HTMLDivElement>) =>
    setIsCompact(event.currentTarget.scrollTop > HEADER_COMPACT_OFFSET);
  const handleRetry = () => void refetch();
  const handleDeleteOpen = () => setIsDeleteOpen(true);
  const handleDeleteCancel = () => setIsDeleteOpen(false);
  const handleDeleteOpenChange = (open: boolean) => {
    if (!open) setIsDeleteOpen(false);
  };
  const handleDeleteConfirm = async () => {
    try {
      await deleteReview(professorId);
      setIsDeleteOpen(false);
      toast.success(t('study.reviewDeleted'));
    } catch {
      toast.error(t('apiState.error'));
    }
  };

  return (
    <div
      data-hide-bottom-tabs
      onScroll={handleScroll}
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-ink px-4"
    >
      <UICollapsingHeader
        title={t('study.reviews')}
        isCompact={isCompact}
        onBack={onClose}
        backLabel={t('app.back')}
      />
      <div className="flex flex-1 flex-col pb-4">
        {isPending ? (
          <StudyRowSkeleton />
        ) : isError ? (
          <div className="p-5 text-center">
            <UIQueryError retry={handleRetry} />
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-3">
            {/* the same card as in the list: average, and your stars to rate */}
            <ProfessorPhoneRow professor={professor} />
            {!areReviewsPending && reviews.length === 0 && (
              <p className="text-body text-secondary">{t('study.noReviews')}</p>
            )}
          </div>
        )}
        {professor && reviews.length > 0 && (
          <ul aria-label={t('study.reviews')} className="flex flex-col gap-4.5">
            {reviews.map((review) => (
              <li key={review.id} className="flex flex-col gap-1.5">
                <p className="text-body wrap-anywhere whitespace-pre-wrap text-white-80">
                  {review.content}
                </p>
                <div className="flex items-center gap-4">
                  <time
                    dateTime={review.updatedAt}
                    className="min-w-0 flex-1 text-micro text-secondary"
                  >
                    {date.format(new Date(review.updatedAt))}
                  </time>
                  {/* yours is changed in the form below, and is not yours to report */}
                  {!review.isMine && (
                    <ReportButton
                      targetType="professor_review"
                      targetId={review.id}
                      placement="bottom"
                      renderTrigger={({ label, onOpen }) => (
                        <button
                          type="button"
                          aria-label={label}
                          data-ph-capture-attribute-label="Report professor review"
                          onClick={onOpen}
                          className="text-micro font-semibold text-red"
                        >
                          {t('report.action')}
                        </button>
                      )}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        {isFetchingNextPage && <StudySkeletonText />}
        <div ref={endRef} aria-hidden="true" />
      </div>
      {professor && (
        <div className="sticky bottom-0 z-20 -mx-4 bg-ink px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <ProfessorReviewForm
            // a new form when your saved review changes, so the field starts from it
            key={myReview?.content ?? ''}
            professorId={professorId}
            myReviewContent={myReview?.content}
            onDelete={handleDeleteOpen}
          />
        </div>
      )}
      <UIDialog
        open={isDeleteOpen}
        onOpenChange={handleDeleteOpenChange}
        dismissible={!isDeleting}
        title={t('study.deleteReviewTitle')}
        description={t('study.deleteReviewDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" disabled={isDeleting} onClick={handleDeleteCancel}>
            {t('app.cancel')}
          </UIButton>
          <UIButton bg="danger" disabled={isDeleting} onClick={() => void handleDeleteConfirm()}>
            {t('app.remove')}
          </UIButton>
        </div>
      </UIDialog>
    </div>
  );
}

type ProfessorReviewFormProps = {
  professorId: string;
  /** Your saved review's text: the field starts from it and Remove shows. */
  myReviewContent?: string;
  onDelete: () => void;
};

/** The mobile app's ProfessorReviewForm: a fixed field above the button, holding your saved review. */
function ProfessorReviewForm({ professorId, myReviewContent, onDelete }: ProfessorReviewFormProps) {
  const { t } = useTranslation();
  const hasMyReview = myReviewContent !== undefined;
  const { mutateAsync: saveReview, isPending: isSaving } = useReviewProfessor();
  const [content, setContent] = useState(myReviewContent ?? '');
  const isValid = courseCommentSchema.safeParse({ content }).success;
  // your review saves only once changed
  const isSubmitDisabled = isSaving || !isValid || (hasMyReview && content === myReviewContent);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = courseCommentSchema.safeParse({ content });
    if (!result.success || isSubmitDisabled) return;
    try {
      await saveReview({ id: professorId, content: result.data.content });
      // the progress toast turns into this one; the screen remounts the form with the saved text
      toast.success(t('study.reviewSaved'));
    } catch (error) {
      toast.error(t(apiErrorKey(error)));
    }
  };
  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <span className="flex items-center gap-3">
          <span className="min-w-0 flex-1 text-detail font-semibold">{t('study.yourReview')}</span>
          {hasMyReview && (
            <button
              type="button"
              disabled={isSaving}
              onClick={onDelete}
              data-ph-capture-attribute-label="Delete professor review"
              className="text-detail font-semibold text-red disabled:opacity-40"
            >
              {t('app.remove')}
            </button>
          )}
        </span>
        <textarea
          aria-label={t('study.yourReview')}
          className="app-control h-24 resize-none"
          maxLength={1000}
          disabled={isSaving}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <span className="flex items-center gap-3 text-micro text-secondary">
          <span className="min-w-0 flex-1">{t('study.reviewHint')}</span>
          <span>{content.length} / 1000</span>
        </span>
      </div>
      <UIButton type="submit" size="md" className="w-full" disabled={isSubmitDisabled}>
        {t(hasMyReview ? 'study.saveReview' : 'app.submit')}
      </UIButton>
    </form>
  );
}
