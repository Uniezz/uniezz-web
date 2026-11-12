import type { UploadMaterialButtonProps } from '@/@types';
import { useNavigate } from '@tanstack/react-router';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UIButton } from '@/ui/components';

export function UploadMaterialButton({ courseId }: UploadMaterialButtonProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <UIButton
      size="sm"
      bg="secondary"
      className="min-h-11 w-auto justify-between rounded-xl px-3 py-2.5 text-label font-medium"
      onClick={() =>
        void navigate({
          to: '/exams/courses/$courseId/upload',
          params: { courseId },
          search: (previous) => ({ ...previous, tab: 'reviews' }),
        })
      }
    >
      {t('courses.chooseFiles')}
      <Upload size={18} aria-hidden="true" />
    </UIButton>
  );
}
