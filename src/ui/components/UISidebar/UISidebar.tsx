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
import { useTranslation } from 'react-i18next';
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
  { to: '/feed', labelKey: 'feed.title', leftIcon: Newspaper },
  { to: '/chat', labelKey: 'chat.title', leftIcon: MessageSquare },
  { to: '/connections', labelKey: 'connections.title', leftIcon: Sparkles },
] as const;

const ACADEMICS_NAV = [
  { to: '/exams', labelKey: 'exams.title', leftIcon: LibraryBig },
  { to: '/guide', labelKey: 'guide.title', leftIcon: MapPin },
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
  const { t } = useTranslation();
  const toggleLabel = collapsed ? t('sidebar.expand') : t('sidebar.collapse');

  return (
    <aside className={cn(sidebarStyles({ collapsed }), className)} {...props}>
      <div className={sidebarHeaderStyles({ collapsed })}>
        <div className={sidebarMarkStyles()}>
          <GraduationCap className="text-ice" size={19} />
        </div>
        {collapsed ? null : (
          <span className="text-[21px] font-bold tracking-[-0.3px] text-ice">
            {t('common.appName')}
          </span>
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

      <nav aria-label={t('sidebar.mainNavigation')} className="flex flex-col">
        <div className={sidebarGroupStyles({ collapsed })}>
          {MAIN_NAV.map(({ labelKey, ...item }) => (
            <UINavItem
              key={item.to}
              {...item}
              label={t(labelKey)}
              count={counts?.[item.to]}
              collapsed={collapsed}
            />
          ))}
        </div>

        <div className={cn(sidebarGroupStyles({ collapsed }), 'pt-2.5 pb-1')}>
          {collapsed ? (
            <div className="mx-2 my-1.5 h-px bg-blue-light" />
          ) : (
            <span className={sidebarCaptionStyles()}>{t('sidebar.academics')}</span>
          )}
          {ACADEMICS_NAV.map(({ labelKey, ...item }) => (
            <UINavItem
              key={item.to}
              {...item}
              label={t(labelKey)}
              count={counts?.[item.to]}
              collapsed={collapsed}
            />
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
              aria-label={t('sidebar.settings')}
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
