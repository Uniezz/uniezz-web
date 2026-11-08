import { Link } from '@tanstack/react-router';
import { type VariantProps } from 'class-variance-authority';
import { type LucideIcon } from 'lucide-react';
import { Children, type ComponentProps, type MouseEventHandler, type ReactNode } from 'react';
import { cn } from '../../cn';
import { buttonStyles, iconColorClass } from './variants';

type UIButtonProps = VariantProps<typeof buttonStyles> &
  Omit<ComponentProps<'button'>, 'onClick' | 'onAuxClick'> & {
    onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
    onAuxClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
    children: ReactNode;
    navigateTo?: string;
    leftIcon?: LucideIcon;
    leftIconColor?: keyof typeof iconColorClass;
  };

export const UIButton = ({
  children,
  id,
  navigateTo,
  size,
  bg,
  leftIcon: LeftIcon,
  leftIconColor = bg === 'primary' || bg === 'gradient' || !bg ? 'primary' : 'white',
  className,
  type = 'button',
  disabled,
  onClick,
  onAuxClick,
  ...props
}: UIButtonProps) => {
  const classes = cn(buttonStyles({ size, bg }), className);
  // PostHog masks autocaptured text, so expose the visible label explicitly.
  // shortcut: text nested inside elements (e.g. <UIText>) is not read; pass aria-label instead.
  const visibleText = Children.toArray(children)
    .filter((child) => typeof child === 'string')
    .join('')
    .trim();
  const analyticsLabel = props['aria-label'] ?? (visibleText || undefined);
  const icon = LeftIcon ? <LeftIcon className={iconColorClass[leftIconColor]} size={16} /> : null;

  if (navigateTo) {
    return (
      <Link
        onClick={onClick}
        onAuxClick={onAuxClick}
        id={id}
        data-ph-capture-attribute-label={analyticsLabel}
        disabled={disabled}
        className={classes}
        to={navigateTo}
      >
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      onAuxClick={onAuxClick}
      id={id}
      data-ph-capture-attribute-label={analyticsLabel}
      type={type}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
