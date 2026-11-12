import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { UIButton } from '@/ui/components';

export function CreateCourseButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <UIButton
      size="sm"
      onClick={() =>
        void navigate({
          to: '/exams/courses/new',
          search: (previous) => ({ ...previous, tab: 'reviews' }),
        })
      }
    >
      {t('courses.create')}
    </UIButton>
  );
}
