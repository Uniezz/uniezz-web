import { Link, type LinkProps } from '@tanstack/react-router';
import { type LucideIcon } from 'lucide-react';
import { cn } from '../../cn';
import {
  navItemBadgeStyles,
  navItemIconStyles,
  navItemLabelStyles,
  navItemStyles,
} from './variants';

type UINavItemProps = {
  to: LinkProps['to'];
  label: string;
  leftIcon: LucideIcon;
  count?: number;
  collapsed?: boolean;
  className?: string;
};

export const UINavItem = ({
  to,
  label,
  leftIcon: LeftIcon,
  count,
  collapsed,
  className,
}: UINavItemProps) => {
  return (
    <Link
      to={to}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
      className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue"
    >
      {({ isActive }) => (
        <div className={cn(navItemStyles({ active: isActive, collapsed }), className)}>
          <span className="relative z-10 flex w-full items-center gap-3">
            <LeftIcon className={navItemIconStyles({ active: isActive })} size={19} />
            {collapsed ? null : (
              <span className={navItemLabelStyles({ active: isActive })}>{label}</span>
            )}
            {!collapsed && count ? (
              <span className={navItemBadgeStyles({ active: isActive })}>{count}</span>
            ) : null}
          </span>
        </div>
      )}
    </Link>
  );
};
