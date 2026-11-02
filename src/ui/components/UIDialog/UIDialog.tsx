import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../cn';
import { UIButton } from '../UIButton';
import {
  dialogOverlayStyles,
  dialogStyles,
  dialogTitleStyles,
  dialogDescriptionStyles,
  dialogCloseStyles,
} from './variants';

export type UIDialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
  dismissible?: boolean;
  className?: string;
};
export const UIDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  dismissible = true,
  className,
}: UIDialogProps) => {
  const { t } = useTranslation();
  const opener = useRef<HTMLElement | null>(null);
  return (
    <Dialog.Root open={open} onOpenChange={dismissible ? onOpenChange : undefined}>
      <Dialog.Portal>
        <Dialog.Overlay className={dialogOverlayStyles()} />
        <Dialog.Content
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
          className={cn(dialogStyles(), className)}
        >
          <Dialog.Title className={dialogTitleStyles()}>{title}</Dialog.Title>
          <Dialog.Description className={dialogDescriptionStyles()}>
            {description}
          </Dialog.Description>
          {dismissible && (
            <Dialog.Close asChild>
              <UIButton
                bg="transparent"
                size="icon"
                className={dialogCloseStyles()}
                aria-label={t('app.close')}
              >
                <X size={18} />
              </UIButton>
            </Dialog.Close>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
