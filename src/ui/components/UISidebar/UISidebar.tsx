import {
  GraduationCap,
  LibraryBig,
  MapPin,
  MessageSquare,
  Newspaper,
  PanelLeft,
  Settings,
  Sparkles,
} from 'lucide-react';
import { type ComponentProps, memo } from 'react';
import { cn } from '../../cn';
import { UINavItem } from '../UINavItem';
import {
  sidebarCaptionStyles,
  sidebarGroupStyles,
  sidebarHeaderStyles,
  sidebarMarkStyles,
  sidebarStyles,
  sidebarToggleStyles,
  sidebarUserStyles,
} from './variants';

const MAIN_NAV = [
  { to: '/feed', label: 'Feed', leftIcon: Newspaper },
  { to: '/chat', label: 'Chat', leftIcon: MessageSquare },
  { to: '/connections', label: 'Connections', leftIcon: Sparkles },
] as const;

const ACADEMICS_NAV = [
  { to: '/exams', label: 'Exams & Courses', leftIcon: LibraryBig },
  { to: '/guide', label: 'Student Guide', leftIcon: MapPin },
] as const;

type UISidebarProps = ComponentProps<'aside'> & {
  user: { initials: string; name: string; meta: string };
  counts?: Record<string, number>;
  collapsed?: boolean;
  onCollapsedToggle?: () => void;
  onSettingsClick?: () => void;
};

const UISidebarBase = ({
  user,
  counts,
  collapsed,
  onCollapsedToggle,
  onSettingsClick,
  className,
  ...props
}: UISidebarProps) => {
  const toggleLabel = collapsed ? 'Expand sidebar' : 'Collapse sidebar';

  return (
    <aside className={cn(sidebarStyles({ collapsed }), className)} {...props}>
      <div className={sidebarHeaderStyles({ collapsed })}>
        <div className={sidebarMarkStyles()}>
          <GraduationCap className="text-ice" size={19} />
        </div>
        {collapsed ? null : (
          <span className="text-[21px] font-bold tracking-[-0.3px] text-ice">Uniezz</span>
        )}
        <button
          type="button"
          aria-label={toggleLabel}
          aria-expanded={!collapsed}
          title={toggleLabel}
          onClick={onCollapsedToggle}
          className={sidebarToggleStyles({ collapsed })}
        >
          <PanelLeft size={18} />
        </button>
      </div>

      <nav aria-label="Main navigation" className="flex flex-col">
        <div className={sidebarGroupStyles({ collapsed })}>
          {MAIN_NAV.map((item) => (
            <UINavItem key={item.to} {...item} count={counts?.[item.to]} collapsed={collapsed} />
          ))}
        </div>

        <div className={cn(sidebarGroupStyles({ collapsed }), 'pt-2.5 pb-1')}>
          {collapsed ? (
            <div className="mx-2 my-1.5 h-px bg-blue-light" />
          ) : (
            <span className={sidebarCaptionStyles()}>ACADEMICS</span>
          )}
          {ACADEMICS_NAV.map((item) => (
            <UINavItem key={item.to} {...item} count={counts?.[item.to]} collapsed={collapsed} />
          ))}
        </div>
      </nav>

      <div className={sidebarUserStyles({ collapsed })}>
        <div
          title={collapsed ? user.name : undefined}
          className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-blue"
        >
          <span className="text-sm font-bold text-ice">{user.initials}</span>
        </div>
        {collapsed ? null : (
          <>
            <div className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="truncate text-sm font-bold text-ice">{user.name}</span>
              <span className="truncate text-caption font-normal text-navy-muted">{user.meta}</span>
            </div>
            <button
              type="button"
              aria-label="Settings"
              onClick={onSettingsClick}
              className="shrink-0 rounded-md text-navy-muted outline-none hover:text-ice focus-visible:ring-2 focus-visible:ring-ice"
            >
              <Settings size={17} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
};

export const UISidebar = memo(UISidebarBase);
