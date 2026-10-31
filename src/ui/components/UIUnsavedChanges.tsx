import { useBlocker } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { UIButton } from './UIButton';
import { UIDialog } from './UIDialog';

export function UIUnsavedChanges({ dirty }: { dirty: boolean }) {
  const { t } = useTranslation();
  const blocker = useBlocker({
    shouldBlockFn: () => dirty,
    enableBeforeUnload: () => dirty,
    withResolver: true,
  });

  if (blocker.status !== 'blocked') return null;
  return (
    <UIDialog
      open
      onOpenChange={(open) => {
        if (!open) blocker.reset();
      }}
      title={t('app.unsavedChangesTitle')}
      description={t('app.discardChangesDescription')}
    >
      <div className="flex justify-end gap-3">
        <UIButton bg="secondary" onClick={blocker.reset}>
          {t('app.keepEditing')}
        </UIButton>
        <UIButton bg="danger" onClick={blocker.proceed}>
          {t('app.discardChanges')}
        </UIButton>
      </div>
    </UIDialog>
  );
}
