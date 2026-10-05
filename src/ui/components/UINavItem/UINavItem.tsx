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
      className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ice"
    >
      {({ isActive }) => (
        <div className={cn(navItemStyles({ active: isActive, collapsed }), className)}>
          <LeftIcon className={navItemIconStyles({ active: isActive })} size={18} />
          {collapsed ? null : (
            <span className={navItemLabelStyles({ active: isActive })}>{label}</span>
          )}
          {!collapsed && count ? (
            <span className={navItemBadgeStyles({ active: isActive })}>{count}</span>
          ) : null}
        </div>
      )}
    </Link>
  );
};
