import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useRef, type PointerEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../cn';
import { UIButton } from '../UIButton';
import {
  dialogOverlayStyles,
  dialogStyles,
  dialogTitleStyles,
  dialogDescriptionStyles,
  dialogCloseStyles,
  dialogHandleStyles,
  dialogGrabStyles,
  dialogSheetTitleStyles,
  dialogRightSheetStyles,
} from './variants';

export type UIDialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  /** Optional: a sheet without one, as the mobile app's, drops it. */
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  dismissible?: boolean;
  /** `bottom` is a bottom sheet on a phone and a centered dialog from `lg` up. */
  placement?: 'center' | 'right' | 'bottom';
  /** With `placement="right"`: a bottom sheet on a phone instead of a full-screen panel, as the mobile app's form sheets. */
  sheet?: boolean;
  className?: string;
};
export const UIDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  dismissible = true,
  placement = 'center',
  sheet = false,
  className,
}: UIDialogProps) => {
  const { t } = useTranslation();
  const opener = useRef<HTMLElement | null>(null);
  const content = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const isSheet = placement === 'bottom' || (sheet && placement === 'right');
  // the mobile app's pan-down to close: drag the grabber strip down past 80px
  const handleDragStart = (event: PointerEvent<HTMLDivElement>) => {
    if (!dismissible) return;
    dragStart.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handleDragMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null || !content.current) return;
    content.current.style.transform = `translateY(${Math.max(0, event.clientY - dragStart.current)}px)`;
  };
  const handleDragEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null || !content.current) return;
    const distance = event.clientY - dragStart.current;
    dragStart.current = null;
    content.current.style.transform = '';
    if (distance > 80) onOpenChange?.(false);
  };
  return (
    <Dialog.Root open={open} onOpenChange={dismissible ? onOpenChange : undefined}>
      <Dialog.Portal>
        <Dialog.Overlay className={dialogOverlayStyles()} />
        <Dialog.Content
          ref={content}
          {...(description ? {} : { 'aria-describedby': undefined })}
          onOpenAutoFocus={() => {
            opener.current =
              document.activeElement instanceof HTMLElement ? document.activeElement : null;
          }}
          onCloseAutoFocus={(event) => {
            if (opener.current?.isConnected) {
              event.preventDefault();
              opener.current.focus();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (!dismissible) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (!dismissible) e.preventDefault();
          }}
          className={cn(
            dialogStyles({ placement }),
            placement === 'right' && footer && 'bg-surface',
            sheet && placement === 'right' && dialogRightSheetStyles(),
            className,
          )}
        >
          {isSheet && (
            <div
              aria-hidden
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
              className={dialogGrabStyles()}
            >
              <span className={dialogHandleStyles()} />
            </div>
          )}
          <Dialog.Title className={cn(dialogTitleStyles(), isSheet && dialogSheetTitleStyles())}>
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description className={dialogDescriptionStyles()}>
              {description}
            </Dialog.Description>
          )}
          {dismissible && (
            <Dialog.Close asChild>
              <UIButton
                bg="transparent"
                size="icon"
                // a phone's sheet closes by swiping or tapping outside, as in the mobile app
                className={cn(dialogCloseStyles(), isSheet && 'max-lg:hidden')}
                aria-label={t('app.close')}
              >
                <X size={18} />
              </UIButton>
            </Dialog.Close>
          )}
          <div
            className={
              placement === 'right'
                ? `scrollbar-hidden flex min-h-0 flex-1 flex-col ${footer ? 'overflow-hidden' : 'overflow-y-auto'}`
                : undefined
            }
          >
            {children}
          </div>
          {footer}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
