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
      leftIcon={Upload}
      onClick={() =>
        void navigate({
          to: '/exams/courses/$courseId/upload',
          params: { courseId },
          search: (previous) => ({ ...previous, tab: 'reviews' }),
        })
      }
    >
      {t('exams.action')}
    </UIButton>
  );
}
