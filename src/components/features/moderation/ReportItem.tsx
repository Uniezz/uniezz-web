import { useLocation, useNavigate } from '@tanstack/react-router';
import { Check, Eye, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ReportItemProps } from '@/@types';
import { useDismissReport, useMyProfile, useRemoveContent, useReviewReport } from '@/hooks';
import { UIButton, UIPanel, UITags } from '@/ui/components';
import {
  isAdmin,
  isRemovableTarget,
  reportReasonLabel,
  reportTargetLabel,
  snapshotPreview,
  toast,
} from '@/utils';
import { BanButton } from './BanButton';
import { ConfirmActionButton } from './ConfirmActionButton';

/** One pending report with the decisions a moderator can make on it. */
export function ReportItem({ report }: ReportItemProps) {
  const { t, i18n } = useTranslation();
  const { data: me } = useMyProfile();
  const { mutateAsync: review, isPending: isReviewing } = useReviewReport();
  const { mutateAsync: dismiss, isPending: isDismissing } = useDismissReport();
  const { mutateAsync: removeContent } = useRemoveContent();
  const navigate = useNavigate();
  const href = useLocation({ select: (location) => location.href });
  const { targetType, targetId, snapshot } = report;
  const postId =
    targetType === 'post' ? targetId : typeof snapshot.postId === 'string' && snapshot.postId;
  const courseId =
    targetType === 'course' ? targetId : typeof snapshot.courseId === 'string' && snapshot.courseId;
  const canOpen = Boolean(postId || courseId || targetType === 'user');
  const authorId = targetType === 'user' ? targetId : report.targetAuthorId;
  // Only admins may remove a whole course, with every student's files on it.
  const canRemove = isRemovableTarget(targetType) && (targetType !== 'course' || isAdmin(me));
  const busy = isReviewing || isDismissing;
  const { heading, body, tags } = snapshotPreview(report.snapshot);

  // Where a moderator can see the reported content, when the app has a page for it.
  function openContent() {
    if (postId)
      return navigate({ to: '/feed/post/$postId', params: { postId }, search: { postFrom: href } });
    if (courseId)
      return navigate({
        to: '/exams/courses/$courseId',
        params: { courseId },
        search: { tab: 'reviews', courseFrom: href },
      });
    return navigate({
      to: '/connections/students/$profileId',
      params: { profileId: targetId },
      search: { studentSearch: undefined, from: href },
    });
  }

  async function settle(action: (id: string) => Promise<unknown>, success: string) {
    try {
      await action(report.id);
      toast.success(success);
    } catch {
      toast.error(t('apiState.error'));
    }
  }

  return (
    <UIPanel surface="tint" className="space-y-3 rounded-programme p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-section font-semibold">
          {t(reportTargetLabel(targetType))}
          {' · '}
          {t(reportReasonLabel(report.reason))}
        </h3>
        <p className="text-detail text-secondary">
          {new Intl.DateTimeFormat(i18n.resolvedLanguage, {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(report.createdAt))}
        </p>
      </div>
      {report.details && (
        <p className="whitespace-pre-line text-white-80">
          <span className="text-secondary">{t('moderation.details')}: </span>
          {report.details}
        </p>
      )}
      {heading || body || tags.length > 0 ? (
        <blockquote className="space-y-2 border-l-2 border-white-20 pl-4">
          {heading && <p className="font-semibold wrap-anywhere text-white">{heading}</p>}
          {body && <p className="wrap-anywhere whitespace-pre-line text-white-80">{body}</p>}
          <UITags tags={tags} />
        </blockquote>
      ) : (
        <p className="text-detail text-secondary">{t('moderation.noSnapshot')}</p>
      )}
      <div className="flex flex-wrap items-center justify-end gap-1 border-t border-white-10 pt-3">
        {canOpen && (
          <UIButton
            size="icon"
            bg="plain"
            aria-label={t('moderation.openContent')}
            title={t('moderation.openContent')}
            onClick={() => void openContent()}
          >
            <Eye className="size-5" aria-hidden="true" />
          </UIButton>
        )}
        <UIButton
          size="icon"
          bg="plain"
          aria-label={t('moderation.dismiss')}
          title={t('moderation.dismiss')}
          disabled={busy}
          onClick={() => void settle(dismiss, t('moderation.dismissed'))}
        >
          <X className="size-5" aria-hidden="true" />
        </UIButton>
        <UIButton
          size="icon"
          bg="plain"
          aria-label={t('moderation.review')}
          title={t('moderation.review')}
          disabled={busy}
          onClick={() => void settle(review, t('moderation.reviewed'))}
        >
          <Check className="size-5" aria-hidden="true" />
        </UIButton>
        {canRemove && (
          <ConfirmActionButton
            label={t('moderation.remove')}
            description={t('moderation.removeDescription')}
            success={t('moderation.removed')}
            onConfirm={() => removeContent({ type: targetType, id: targetId })}
            icon={Trash2}
            danger
          />
        )}
        {authorId && <BanButton userId={authorId} iconOnly />}
      </div>
    </UIPanel>
  );
}
