import { ArrowUp, Flag, Pencil, Trash2 } from 'lucide-react';
import { useState, type FormEvent, type UIEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { CourseComment, CourseDetailsDialogProps } from '@/@types';
import {
  useAddCourseComment,
  useCourse,
  useCourseComments,
  useCourseFiles,
  useDeleteCourseComment,
  useEndReached,
  useLeaveWhenGone,
  useRateCourse,
} from '@/hooks';
import { courseCommentSchema } from '@/schemas';
import { UIButton, UICollapsingHeader, UIDialog, UIQueryError } from '@/ui/components';
import { apiErrorKey, chatTime, toast } from '@/utils';
import { ReportButton } from '@/components/features/reports';
import { CourseFormDialog } from './CourseFormDialog';
import { DifficultyFlames } from './DifficultyFlames';
import { RatingInput } from './RatingInput';
import { StudyFilePhoneRow } from './StudyFilePhoneRow';
import { StudyRowSkeleton } from './StudyRowSkeleton';
import { StudySkeletonText } from './StudySkeletonText';

// as the mobile app's collapsing headers: compact once scrolled past this
const HEADER_COMPACT_OFFSET = 24;

/** The mobile app's course screen: the course card, its files, comments and a pinned comment field. */
export function CoursePhoneScreen({ courseId, onClose }: CourseDetailsDialogProps) {
  const { t, i18n } = useTranslation();
  const { data: course, isPending, isError, error, refetch } = useCourse(courseId);
  useLeaveWhenGone(error, t('share.courseGone'), onClose);
  const { data: filePages } = useCourseFiles(courseId);
  const {
    data: commentPages,
    isPending: areCommentsPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useCourseComments(courseId);
  const { mutate: rate, isPending: isRating, variables: rating } = useRateCourse();
  const { mutateAsync: addComment, isPending: isAddingComment } = useAddCourseComment();
  const { mutateAsync: deleteComment, isPending: isDeleting } = useDeleteCourseComment();
  const [isCompact, setIsCompact] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const files = filePages?.pages[0]?.items ?? [];
  const comments = commentPages?.pages.flatMap((page) => page.items ?? []) ?? [];
  const endRef = useEndReached<HTMLDivElement>(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  });
  const isCommentValid = courseCommentSchema.safeParse({ content: comment }).success;

  const handleScroll = (event: UIEvent<HTMLDivElement>) =>
    setIsCompact(event.currentTarget.scrollTop > HEADER_COMPACT_OFFSET);
  const handleRetry = () => void refetch();
  const handleEditOpen = () => setIsEditOpen(true);
  const handleEditClose = () => setIsEditOpen(false);
  const handleRate = (value: number) =>
    rate(
      { id: courseId, rating: value },
      { onError: (error) => toast.error(t(apiErrorKey(error))) },
    );
  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = courseCommentSchema.safeParse({ content: comment });
    if (!result.success || isAddingComment) return;
    try {
      await addComment({ courseId, body: result.data });
      setComment('');
    } catch (error) {
      toast.error(t(apiErrorKey(error)));
    }
  };
  const handleDeleteOpenChange = (open: boolean) => {
    if (!open) setDeleteId(null);
  };
  const handleDeleteCancel = () => setDeleteId(null);
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteComment(deleteId);
      setDeleteId(null);
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
        title={course?.name ?? ''}
        isCompact={isCompact}
        onBack={onClose}
        backLabel={t('app.back')}
        actions={
          course && (
            <>
              {course.isMine && (
                <UIButton
                  size="square"
                  bg="glass"
                  aria-label={t('study.editCourse')}
                  onClick={handleEditOpen}
                >
                  <Pencil size={18} aria-hidden="true" />
                </UIButton>
              )}
              <ReportButton
                targetType="course"
                targetId={courseId}
                placement="bottom"
                renderTrigger={({ label, onOpen }) => (
                  <UIButton size="square" bg="glass" aria-label={label} onClick={onOpen}>
                    <Flag size={18} aria-hidden="true" />
                  </UIButton>
                )}
              />
            </>
          )
        }
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
            <section className="flex flex-col gap-3.5 rounded-2xl p-4 glass">
              <div className="flex flex-col gap-1">
                <p className="text-body font-semibold wrap-anywhere">{course.subject}</p>
                <p className="text-detail wrap-anywhere text-secondary">
                  {course.faculty} · {t('study.semesterShort', { semester: course.semester })}
                </p>
              </div>
              {course.description && (
                <p className="text-body leading-5.5 wrap-anywhere whitespace-pre-wrap text-white-80">
                  {course.description}
                </p>
              )}
              <div className="flex items-start justify-between gap-3 border-t border-white-10 pt-3.5">
                <div className="flex flex-col gap-1">
                  <span className="text-micro text-secondary">{t('study.difficulty')}</span>
                  <DifficultyFlames difficulty={course.difficulty} size={16} />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-micro text-secondary">{t('study.averageRating')}</span>
                  <span className="text-body font-semibold">
                    {course.ratingAverage > 0 ? (
                      <>
                        <span className="text-amber">★ </span>
                        {t('study.ratingSummary', {
                          rating: course.ratingAverage.toFixed(1),
                          votes: course.ratingCount,
                        })}
                      </>
                    ) : (
                      t('study.noRatings')
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-white-10 pt-3.5">
                <span className="text-detail text-secondary">{t('study.yourRating')}</span>
                <RatingInput
                  size="compact"
                  average={course.ratingAverage}
                  count={course.ratingCount}
                  // the picked stars show while the rating saves, then the API's
                  myRating={isRating ? (rating?.rating ?? null) : course.myRating}
                  disabled={isRating}
                  analyticsLabel="Rate course"
                  onRate={handleRate}
                />
              </div>
            </section>
            {files.length > 0 && (
              <section className="flex flex-col gap-2" aria-label={t('study.files')}>
                <h2 className="text-section font-semibold">{t('study.files')}</h2>
                <ul className="flex flex-col gap-2">
                  {files.map((file) => (
                    <StudyFilePhoneRow key={file.id} file={file} />
                  ))}
                </ul>
              </section>
            )}
            <h2 className="text-section font-semibold">{t('study.comments')}</h2>
            {areCommentsPending && <StudySkeletonText count={3} />}
            {!areCommentsPending && comments.length === 0 && (
              <p className="text-body text-secondary">{t('study.noComments')}</p>
            )}
          </div>
        )}
        {course && comments.length > 0 && (
          <ul aria-label={t('study.comments')}>
            {comments.map((item) => (
              <CourseCommentItem
                key={item.id}
                comment={item}
                time={chatTime(item.createdAt, i18n.resolvedLanguage ?? 'en')}
                onDelete={setDeleteId}
              />
            ))}
          </ul>
        )}
        {isFetchingNextPage && <StudySkeletonText />}
        <div ref={endRef} aria-hidden="true" />
      </div>
      {course && (
        // pinned under the list on the ink background, as the app's CommentComposer
        <form
          onSubmit={(event) => void handleSend(event)}
          className="sticky bottom-0 z-20 -mx-4 flex items-end gap-2 bg-ink px-4 pt-2 pb-[max(12px,env(safe-area-inset-bottom))]"
        >
          <textarea
            rows={1}
            maxLength={1000}
            value={comment}
            disabled={isAddingComment}
            aria-label={t('app.addComment')}
            placeholder={t('app.addComment')}
            onChange={(event) => setComment(event.target.value)}
            className="field-sizing-content max-h-28 min-h-11 min-w-0 flex-1 resize-none rounded-3xl border border-white-10 bg-white-5 px-4 py-2.5 text-base leading-6 text-white outline-none placeholder:text-secondary"
          />
          <button
            type="submit"
            aria-label={t('app.send')}
            data-ph-capture-attribute-label={t('app.send')}
            disabled={isAddingComment || !isCommentValid}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink disabled:opacity-40"
          >
            <ArrowUp size={18} aria-hidden="true" />
          </button>
        </form>
      )}
      {course && isEditOpen && (
        <CourseFormDialog course={course} onClose={handleEditClose} onDeleted={onClose} />
      )}
      <UIDialog
        open={deleteId !== null}
        onOpenChange={handleDeleteOpenChange}
        dismissible={!isDeleting}
        title={t('study.deleteCommentTitle')}
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

type CourseCommentItemProps = {
  comment: CourseComment;
  time: string;
  onDelete: (id: string) => void;
};

/** The mobile app's CourseCommentItem: text and time, a bare trash or flag icon on the right. */
function CourseCommentItem({ comment, time, onDelete }: CourseCommentItemProps) {
  const { t } = useTranslation();
  const handleDelete = () => onDelete(comment.id);
  const iconClass = 'mt-0.75 shrink-0 text-white-40';
  return (
    <li className="flex items-start gap-2 border-b border-white-10 py-2.5">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-body wrap-anywhere whitespace-pre-wrap">{comment.content}</p>
        <time dateTime={comment.createdAt} className="text-micro text-secondary">
          {time}
        </time>
      </div>
      {comment.isMine ? (
        <button
          type="button"
          aria-label={t('app.remove')}
          data-ph-capture-attribute-label="Delete course comment"
          onClick={handleDelete}
          className={iconClass}
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      ) : (
        <ReportButton
          targetType="course_comment"
          targetId={comment.id}
          placement="bottom"
          renderTrigger={({ label, onOpen }) => (
            <button
              type="button"
              aria-label={label}
              data-ph-capture-attribute-label="Report course comment"
              onClick={onOpen}
              className={iconClass}
            >
              <Flag size={16} aria-hidden="true" />
            </button>
          )}
        />
      )}
    </li>
  );
}
