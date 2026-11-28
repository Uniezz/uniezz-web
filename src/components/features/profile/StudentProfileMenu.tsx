import { Ellipsis, ShieldPlus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BanButton, GrantModeratorButton } from '@/components/features/moderation';
import { ReportButton } from '@/components/features/reports';
import { useBlockStudent, useDropdown, useGoBack, useMyProfile } from '@/hooks';
import { cn } from '@/ui/cn';
import { UIButton, UIDialog } from '@/ui/components';
import { menuStyles } from '@/ui/components/UIMenu/variants';
import { isAdmin, isStaff, toast } from '@/utils';

export type StudentProfileMenuProps = { studentId: string };

const itemClass =
  'flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-body font-medium outline-none enabled:hover:bg-white-5 focus-visible:ring-2 focus-visible:ring-blue disabled:opacity-40';

/** The mobile app's "More options" menu on a student's profile: report and block, plus staff tools. */
export function StudentProfileMenu({ studentId }: StudentProfileMenuProps) {
  const { t } = useTranslation();
  const goBack = useGoBack();
  const { data: me } = useMyProfile();
  const { ref, isOpen, toggle, close } = useDropdown();
  const [isBlockOpen, setIsBlockOpen] = useState(false);
  const { mutateAsync: block, isPending: isBlocking } = useBlockStudent();
  const handleBlockOpen = () => {
    close();
    setIsBlockOpen(true);
  };
  const handleBlockCancel = () => setIsBlockOpen(false);
  const handleBlockConfirm = async () => {
    try {
      await block(studentId);
      setIsBlockOpen(false);
      toast.success(t('students.blocked'));
      goBack({ to: '/connections/students', search: { studentSearch: undefined } });
    } catch {
      toast.error(t('apiState.error'));
    }
  };
  return (
    <div ref={ref} data-dropdown-open={isOpen || undefined} className="relative">
      <button
        type="button"
        aria-label={t('app.moreOptions')}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        data-ph-capture-attribute-label={t('app.moreOptions')}
        onClick={toggle}
        className="flex size-11 items-center justify-center rounded-xl glass"
      >
        <Ellipsis size={18} aria-hidden="true" />
      </button>
      {/* stays mounted while hidden, so the report and staff dialogs outlive the menu */}
      <div role="menu" hidden={!isOpen} className={menuStyles()}>
        <ReportButton
          targetType="user"
          targetId={studentId}
          placement="bottom"
          renderTrigger={({ label, onOpen }) => (
            <button
              type="button"
              role="menuitem"
              data-ph-capture-attribute-label="Report user"
              onClick={() => {
                close();
                onOpen();
              }}
              className={itemClass}
            >
              {label}
            </button>
          )}
        />
        {/* moderation is web-only, so staff reach it from here on a phone */}
        {me && isStaff(me) && (
          <div className={cn(itemClass, 'text-body')}>
            <BanButton userId={studentId} inline />
          </div>
        )}
        {me && isAdmin(me) && (
          <div className={cn(itemClass, 'text-body')}>
            <GrantModeratorButton userId={studentId} icon={ShieldPlus} inline />
          </div>
        )}
        <button
          type="button"
          role="menuitem"
          data-ph-capture-attribute-label="Block student"
          onClick={handleBlockOpen}
          className={cn(itemClass, 'text-red')}
        >
          {t('students.block')}
        </button>
      </div>
      <UIDialog
        open={isBlockOpen}
        onOpenChange={setIsBlockOpen}
        dismissible={!isBlocking}
        title={t('students.blockTitle')}
        description={t('students.blockDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" disabled={isBlocking} onClick={handleBlockCancel}>
            {t('app.cancel')}
          </UIButton>
          <UIButton bg="danger" disabled={isBlocking} onClick={() => void handleBlockConfirm()}>
            {t('students.block')}
          </UIButton>
        </div>
      </UIDialog>
    </div>
  );
}
