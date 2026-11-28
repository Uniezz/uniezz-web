import { ChevronLeft } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/ui/cn';
import { UIButton, UIDialog } from '@/ui/components';

export type ProfileFormSheetProps = {
  open: boolean;
  /** Closing drops unsaved edits; the sheet asks first while `isDirty`. */
  onClose: () => void;
  title: string;
  isDirty: boolean;
  actionLabel: string;
  isActionDisabled: boolean;
  /** The id of the form the action submits, or a press handler. */
  formId?: string;
  onAction?: () => void;
  destructiveLabel?: string;
  onDestructive?: () => void;
  /** A back chevron before the title, as in the app's two-step sheets. */
  onBack?: () => void;
  children: ReactNode;
};

/** Phone-only: the mobile app's UIFormSheet, a bottom sheet whose action stays pinned below the fields. */
export function ProfileFormSheet({
  open,
  onClose,
  title,
  isDirty,
  actionLabel,
  isActionDisabled,
  formId,
  onAction,
  destructiveLabel,
  onDestructive,
  onBack,
  children,
}: ProfileFormSheetProps) {
  const { t } = useTranslation();
  const [confirm, setConfirm] = useState<(() => void) | null>(null);
  // leaving with unsaved edits, by closing or going back, asks first
  const guard = (leave: () => void) => (isDirty ? setConfirm(() => leave) : leave());
  const handleOpenChange = (next: boolean) => {
    if (!next) guard(onClose);
  };
  const handleBack = () => onBack && guard(onBack);
  const handleKeep = () => setConfirm(null);
  const handleDiscard = () => {
    confirm?.();
    setConfirm(null);
  };
  return (
    <>
      <UIDialog
        open={open}
        onOpenChange={handleOpenChange}
        placement="bottom"
        title={title}
        className={cn('flex flex-col px-4 pb-0', onBack && '[&>h2]:pl-8')}
        footer={
          <div className="sticky bottom-0 z-10 -mx-4 mt-2 flex gap-3 bg-linear-to-t from-surface from-70% to-surface/0 px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]">
            {destructiveLabel && (
              <UIButton bg="danger" className="px-6" onClick={onDestructive}>
                {destructiveLabel}
              </UIButton>
            )}
            <UIButton
              type={formId ? 'submit' : 'button'}
              form={formId}
              onClick={onAction}
              disabled={isActionDisabled}
              className="flex-1"
            >
              {actionLabel}
            </UIButton>
          </div>
        }
      >
        {onBack && (
          <UIButton
            size="icon"
            bg="transparent"
            aria-label={t('app.back')}
            onClick={handleBack}
            className="absolute top-6.5 left-2"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </UIButton>
        )}
        <div className="mt-4 flex flex-col gap-3.5">{children}</div>
      </UIDialog>
      <UIDialog
        open={confirm !== null}
        onOpenChange={handleKeep}
        title={t('app.unsavedChangesTitle')}
        description={t('study.discardChangesDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" onClick={handleKeep}>
            {t('app.cancel')}
          </UIButton>
          <UIButton bg="danger" onClick={handleDiscard}>
            {t('study.discard')}
          </UIButton>
        </div>
      </UIDialog>
    </>
  );
}
