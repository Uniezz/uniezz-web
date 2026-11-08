import { Link, useMatchRoute, type LinkProps } from '@tanstack/react-router';
import { type LucideIcon } from 'lucide-react';
import { cn } from '../../cn';
import {
  navItemBadgeStyles,
  navItemIconStyles,
  navItemLabelStyles,
  navItemStyles,
} from './variants';
import { RESET_TAB_SEARCH } from '@/utils/navigation';

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
  const isCurrentTab = Boolean(useMatchRoute()({ to, fuzzy: true }));

  return (
    <Link
      to={to}
      search={isCurrentTab ? ((() => RESET_TAB_SEARCH) as never) : undefined}
      title={collapsed ? label : undefined}
      data-ph-capture-attribute-label={label}
      aria-label={collapsed ? label : undefined}
      className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue"
    >
      {({ isActive }) => (
        <div className={cn(navItemStyles({ active: isActive, collapsed }), className)}>
          <span className="relative z-10 flex w-full items-center gap-3">
            <span className="relative shrink-0">
              <LeftIcon className={navItemIconStyles({ active: isActive })} size={19} />
              {!collapsed && count ? (
                <span className={navItemBadgeStyles({ active: isActive })}>
                  <span className="sr-only">{count}</span>
                </span>
              ) : null}
            </span>
            {collapsed ? null : (
              <span className={navItemLabelStyles({ active: isActive })}>{label}</span>
            )}
          </span>
        </div>
      )}
    </Link>
  );
};
