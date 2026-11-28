import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { StudyFile } from '@/@types';
import { UIButton } from '@/ui/components';
import { studyFileTypeLabels } from '@/utils';
import { PreviewStudyFileButton } from './PreviewStudyFileButton';

export type StudyFilePhoneRowProps = {
  file: StudyFile;
  /** Shows the trash button; the app lists only the student's own files there. */
  onDelete?: (file: StudyFile) => void;
};

/** The mobile app's file StudyRow: title and type; tapping the card previews it. */
export function StudyFilePhoneRow({ file, onDelete }: StudyFilePhoneRowProps) {
  const { t } = useTranslation();
  const handleDelete = () => onDelete?.(file);
  return (
    <li className="relative flex items-center gap-3 rounded-2xl p-3 glass">
      <div className="flex min-w-0 flex-1 flex-col gap-0.75">
        <span className="truncate text-body leading-5 font-semibold">{file.title}</span>
        <span className="truncate text-micro text-secondary">
          {t(studyFileTypeLabels[file.type])}
        </span>
      </div>
      <PreviewStudyFileButton file={file} stretched />
      {onDelete && (
        <UIButton
          size="square"
          bg="glass"
          aria-label={t('exams.deleteFile')}
          onClick={handleDelete}
          className="relative z-10 text-red"
        >
          <Trash2 size={18} aria-hidden="true" />
        </UIButton>
      )}
    </li>
  );
}
