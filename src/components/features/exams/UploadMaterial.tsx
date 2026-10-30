import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// TODO(api): Replace mock options and local metadata-only submission with API-backed upload data and mutations.
import { EXAMSMOCKS } from '@/utils';
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadSchema>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { university: 'Politechnika', type: 'Exam' },
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
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <UIField label={t('app.subject')} error={errors.subject ? t('app.required') : undefined}>
          <input className="app-control" {...register('subject')} maxLength={120} />
        </UIField>
        <UIField label={t('app.university')}>
          <select className="app-control" {...register('university')}>
            {EXAMSMOCKS.universities.map((u) => (
              <option key={u}>{u}</option>
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
