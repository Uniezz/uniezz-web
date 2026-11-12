import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useDeleteConnection } from '@/hooks';
import { UIButton, UIDialog } from '@/ui/components';
import { BlockStudentButton } from './BlockStudentButton';

export function MatchActions({
  connectionId,
  studentId,
}: {
  connectionId: string;
  studentId: string;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutateAsync: unmatch, isPending } = useDeleteConnection();
  async function confirm() {
    try {
      await unmatch(connectionId);
      setOpen(false);
      toast.success(t('connections.unmatched'));
    } catch {
      toast.error(t('apiState.error'));
    }
  }
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <BlockStudentButton studentId={studentId} />
        <UIButton size="pill" bg="secondary" onClick={() => setOpen(true)}>
          {t('connections.unmatch')}
        </UIButton>
      </div>
      <UIDialog
        open={open}
        onOpenChange={setOpen}
        dismissible={!isPending}
        title={t('connections.unmatch')}
        description={t('connections.unmatchDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" disabled={isPending} onClick={() => setOpen(false)}>
            {t('app.cancel')}
          </UIButton>
          <UIButton bg="danger" disabled={isPending} onClick={() => void confirm()}>
            {t('connections.unmatch')}
          </UIButton>
        </div>
      </UIDialog>
    </>
  );
}
