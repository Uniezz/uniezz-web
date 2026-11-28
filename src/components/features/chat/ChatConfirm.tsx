import { useTranslation } from 'react-i18next';

import { UIButton, UIDialog } from '@/ui/components';

export type ChatConfirmProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel: string;
  onConfirm: () => void;
  isPending?: boolean;
};

/** The mobile app's Alert with Cancel and a destructive action. */
export function ChatConfirm({
  open,
  onOpenChange,
  title,
  description = '',
  confirmLabel,
  onConfirm,
  isPending = false,
}: ChatConfirmProps) {
  const { t } = useTranslation();
  const handleCancel = () => onOpenChange(false);
  return (
    <UIDialog
      open={open}
      onOpenChange={onOpenChange}
      dismissible={!isPending}
      title={title}
      description={description}
    >
      <div className="flex justify-end gap-3">
        <UIButton bg="secondary" disabled={isPending} onClick={handleCancel}>
          {t('postComposer.cancel')}
        </UIButton>
        <UIButton bg="danger" disabled={isPending} onClick={onConfirm}>
          {confirmLabel}
        </UIButton>
      </div>
    </UIDialog>
  );
}
