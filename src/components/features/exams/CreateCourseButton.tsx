import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UIButton } from '@/ui/components';
import { CourseFormDialog } from './CourseFormDialog';

export function CreateCourseButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <UIButton size="sm" onClick={() => setOpen(true)}>
        {t('courses.create')}
      </UIButton>
      {open && <CourseFormDialog onClose={() => setOpen(false)} />}
    </>
  );
}
