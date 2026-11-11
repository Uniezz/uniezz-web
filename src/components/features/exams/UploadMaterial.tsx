import { captureAnalytics, trackLocalAction } from '@/utils/analytics';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// TODO(api): Upload the file and attach it to a course once POST /media/uploads accepts kind exam (Uniezz/uniezz-backend#79).
import { useUniversities } from '@/hooks';
import { UIButton, UIDialog, UIField } from '@/ui/components';
import { uploadSchema, type UploadSchema } from '@/schemas';

export function UploadMaterial({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: UploadSchema) => void;
}) {
  const { t } = useTranslation();
  const { data: universities = [] } = useUniversities();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadSchema>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { type: 'Exam' },
  });
  return (
    <UIDialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={t('exams.action')}
      description={t('app.metadataOnly')}
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(
          (values) => trackLocalAction('material_add', () => onSubmit(values)),
          () => captureAnalytics('material_form_validation_failed'),
        )}
      >
        <UIField label={t('app.subject')} error={errors.subject ? t('app.required') : undefined}>
          <input
            autoComplete="off"
            className="app-control"
            {...register('subject')}
            maxLength={120}
          />
        </UIField>
        <UIField label={t('app.university')}>
          <select className="app-control" {...register('university')}>
            {universities.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </UIField>
        <UIField label={t('app.type')}>
          <select className="app-control" {...register('type')}>
            {['Exam', 'Colloquium', 'Lab reports', 'Notes'].map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </UIField>
        <UIButton type="submit">{t('app.submit')}</UIButton>
      </form>
    </UIDialog>
  );
}
