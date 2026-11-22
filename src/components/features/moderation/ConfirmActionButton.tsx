import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ConfirmActionButtonProps } from '@/@types';
import { UIButton, UIDialog } from '@/ui/components';
import { cn } from '@/ui/cn';
import { toast } from '@/utils';

/** A destructive moderation action that asks for confirmation first. */
export function ConfirmActionButton({
  label,
  description,
  onConfirm,
  success,
  disabled,
  children,
  icon: Icon,
  danger,
  inline,
}: ConfirmActionButtonProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function confirm() {
    setIsPending(true);
    try {
      await onConfirm();
      setOpen(false);
      toast.success(success);
    } catch {
      toast.error(t('apiState.error'));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      {Icon && inline ? (
        <UIButton
          size="pill"
          bg="transparent"
          className={cn(
            'min-h-0 gap-1 border-0 p-0 enabled:hover:bg-transparent',
            danger
              ? 'text-danger/70 enabled:hover:text-danger'
              : 'text-secondary enabled:hover:text-white',
          )}
          disabled={disabled}
          onClick={() => setOpen(true)}
        >
          <Icon className="size-3.5" aria-hidden="true" />
          {label}
        </UIButton>
      ) : Icon ? (
        <UIButton
          size="icon"
          bg="plain"
          className={danger ? 'text-danger/70 enabled:hover:text-danger' : undefined}
          aria-label={label}
          title={label}
          disabled={disabled}
          onClick={() => setOpen(true)}
        >
          <Icon className="size-5" aria-hidden="true" />
        </UIButton>
      ) : (
        <UIButton size="sm" bg="secondary" disabled={disabled} onClick={() => setOpen(true)}>
          {children ?? label}
        </UIButton>
      )}
      <UIDialog
        open={open}
        onOpenChange={setOpen}
        dismissible={!isPending}
        title={label}
        description={description}
      >
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" disabled={isPending} onClick={() => setOpen(false)}>
            {t('app.cancel')}
          </UIButton>
          <UIButton bg="danger" disabled={isPending} onClick={() => void confirm()}>
            {label}
          </UIButton>
        </div>
      </UIDialog>
    </>
  );
}
