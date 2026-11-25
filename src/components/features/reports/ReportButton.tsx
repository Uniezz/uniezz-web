import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlagTriangleRight } from 'lucide-react';

import { UIButton } from '@/ui/components';
import { ReportDialog, type ReportTargetType } from './ReportDialog';

export function ReportButton({
  targetType,
  targetId,
  compact = false,
  danger = false,
}: {
  targetType: ReportTargetType;
  targetId: string;
  compact?: boolean;
  danger?: boolean;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const label =
    targetType === 'post'
      ? t('report.post')
      : targetType === 'comment' || targetType === 'course_comment'
        ? t('report.comment')
        : targetType === 'professor_review'
          ? t('report.review')
          : targetType === 'course'
            ? t('report.course')
            : targetType === 'file'
              ? t('report.material')
              : targetType === 'candidate'
                ? t('report.candidate')
                : t('report.user');

  return (
    <>
      <UIButton
        bg="transparent"
        size="pill"
        className={
          compact
            ? 'min-h-0 gap-1.5 rounded-full border border-danger/25 bg-danger-soft py-1 pr-2.5 pl-2 text-micro font-semibold text-danger backdrop-blur-md enabled:hover:border-danger/50 enabled:hover:bg-danger/25'
            : `min-h-0 gap-1 border-0 p-0 ${danger ? 'text-danger/70 enabled:hover:text-danger' : 'text-secondary enabled:hover:text-white'} enabled:hover:bg-transparent`
        }
        onClick={() => setOpen(true)}
      >
        <FlagTriangleRight className="size-3.5" aria-hidden="true" />
        {label}
      </UIButton>
      <ReportDialog
        open={open}
        onClose={() => setOpen(false)}
        title={label}
        targetType={targetType}
        targetId={targetId}
      />
    </>
  );
}
