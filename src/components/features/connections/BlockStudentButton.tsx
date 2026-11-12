import { useState } from 'react';
import { CircleSlash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useBlockStudent } from '@/hooks';
import { UIButton, UIDialog } from '@/ui/components';

export function BlockStudentButton({
  studentId,
  onBlocked,
}: {
  studentId: string;
  onBlocked?: () => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutateAsync: block, isPending } = useBlockStudent();
  async function confirm() {
    try {
      await block(studentId);
      setOpen(false);
      toast.success(t('connections.studentBlocked'));
      onBlocked?.();
    } catch {
      toast.error(t('apiState.error'));
    }
  }
  return (
    <>
      <UIButton
        size="pill"
        bg="transparent"
        className="min-h-0 gap-1 border-0 p-0 text-danger/70 enabled:hover:bg-transparent enabled:hover:text-danger"
        onClick={() => setOpen(true)}
      >
        <CircleSlash className="size-3.5" aria-hidden="true" />
        {t('connections.block')}
      </UIButton>
      <UIDialog
        open={open}
        onOpenChange={setOpen}
        dismissible={!isPending}
        title={t('connections.block')}
        description={t('connections.blockDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" disabled={isPending} onClick={() => setOpen(false)}>
            {t('app.cancel')}
          </UIButton>
          <UIButton bg="danger" disabled={isPending} onClick={() => void confirm()}>
            {t('connections.block')}
          </UIButton>
        </div>
      </UIDialog>
    </>
  );
}
