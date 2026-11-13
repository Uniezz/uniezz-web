import { Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { UIButton } from '@/ui/components';

export function CreateCourseButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <UIButton
      size="icon"
      bg="secondary"
      aria-label={t('courses.create')}
      title={t('courses.create')}
      onClick={() =>
        void navigate({
          to: '/exams/courses/new',
          search: (previous) => ({ ...previous, tab: 'reviews' }),
        })
      }
    >
      <Plus size={18} aria-hidden="true" />
    </UIButton>
  );
}
