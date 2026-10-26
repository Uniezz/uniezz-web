import { Link } from '@tanstack/react-router';
import { type VariantProps } from 'class-variance-authority';
import { type LucideIcon } from 'lucide-react';
import { type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../cn';
import { buttonStyles, iconColorClass } from './variants';

type UIButtonProps = VariantProps<typeof buttonStyles> &
  ComponentProps<'button'> & {
    children: ReactNode;
    navigateTo?: string;
    leftIcon?: LucideIcon;
    leftIconColor?: keyof typeof iconColorClass;
  };

export const UIButton = ({
  children,
  navigateTo,
  size,
  bg,
  leftIcon: LeftIcon,
  leftIconColor = bg === 'primary' || bg === 'gradient' || !bg ? 'primary' : 'white',
  className,
  type = 'button',
  disabled,
  ...props
}: UIButtonProps) => {
  const classes = cn(buttonStyles({ size, bg }), className);
  const icon = LeftIcon ? <LeftIcon className={iconColorClass[leftIconColor]} size={16} /> : null;

  if (navigateTo) {
    return (
      <Link disabled={disabled} className={classes} to={navigateTo}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes} {...props}>
      {icon}
      {children}
    </button>
  );
};
