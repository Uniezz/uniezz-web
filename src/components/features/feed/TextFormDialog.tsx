import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { UIButton, UIDialog, UIField } from '@/ui/components';
import { textFormSchema, type TextFormSchema } from '@/schemas';

type TextFormDialogProps = {
  title: string;
  onClose: () => void;
  onSubmit: (text: string) => void;
};
export function TextFormDialog({ title, onClose, onSubmit }: TextFormDialogProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TextFormSchema>({ resolver: zodResolver(textFormSchema) });
  return (
    <UIDialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={title}
      description={t('app.localOnly')}
    >
      <form
        onSubmit={handleSubmit(({ text }) => {
          onSubmit(text);
          onClose();
        })}
        className="space-y-4"
      >
        <UIField label={t('app.message')} error={errors.text ? t('app.required') : undefined}>
          <textarea {...register('text')} className="app-control min-h-32" maxLength={4000} />
        </UIField>
        <UIButton type="submit">{t('app.submit')}</UIButton>
      </form>
    </UIDialog>
  );
}
