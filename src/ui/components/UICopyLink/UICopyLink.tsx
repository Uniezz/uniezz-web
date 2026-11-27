import { Link2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { captureAnalytics, toast } from '@/utils';
import { cn } from '../../cn';
import { UIButton, type UIButtonProps } from '../UIButton';

export type UICopyLinkProps = Omit<UIButtonProps, 'children' | 'onClick' | 'leftIcon'> & {
  /** The absolute link to copy. */
  url: string;
  /** What is shared, in English, such as "Copy post link"; never user content. */
  analyticsLabel: string;
  /** Only the icon, with the label as its tooltip, for a row of icon actions. */
  iconOnly?: boolean;
};

/** Copies a link to the clipboard; the address bar can't, since in-app addresses are masked. */
export function UICopyLink({
  url,
  analyticsLabel,
  iconOnly,
  className,
  ...props
}: UICopyLinkProps) {
  const { t } = useTranslation();

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      captureAnalytics('link_copied', { label: analyticsLabel });
      toast.success(t('share.copied'));
    } catch {
      toast.error(t('apiState.error'));
    }
  }

  return (
    <UIButton
      size="pill"
      bg="transparent"
      className={cn(
        'min-h-0 gap-1 border-0 p-0 text-secondary enabled:hover:bg-transparent enabled:hover:text-white',
        className,
      )}
      data-ph-capture-attribute-label={analyticsLabel}
      aria-label={iconOnly ? t('share.copyLink') : undefined}
      title={iconOnly ? t('share.copyLink') : undefined}
      onClick={() => void copy()}
      {...props}
    >
      <Link2 className={iconOnly ? 'size-4 shrink-0' : 'size-3.5 shrink-0'} aria-hidden="true" />
      {!iconOnly && t('share.copyLink')}
    </UIButton>
  );
}
