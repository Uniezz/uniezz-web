import { Settings } from 'lucide-react';
import { type ComponentProps, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../cn';
import { UIButton } from '../UIButton';
import { UINavItem } from '../UINavItem';
import {
  sidebarCaptionStyles,
  sidebarGroupStyles,
  sidebarHeaderStyles,
  sidebarMarkStyles,
  sidebarSettingsStyles,
  sidebarStyles,
  sidebarUserStyles,
} from './variants';
import { NAV_GROUPS } from '@/utils';

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
      <div className={sidebarHeaderStyles()}>
        <UIButton
          size="icon"
          bg="transparent"
          aria-label={toggleLabel}
          aria-expanded={!collapsed}
          title={toggleLabel}
          onClick={onCollapsedToggle}
          className={sidebarMarkStyles()}
        >
          <img src="/favicon.png" alt="" className="size-full object-cover" />
        </UIButton>
      </div>

      <nav aria-label={t('sidebar.mainNavigation')} className="flex flex-col">
        {NAV_GROUPS.map(({ titleKey, items }) => (
          <div
            key={titleKey ?? 'main'}
            className={sidebarGroupStyles({ collapsed, section: Boolean(titleKey) })}
          >
            {titleKey &&
              (collapsed ? (
                <div className="mx-2 my-1.5 h-px bg-white/10" />
              ) : (
                <span className={sidebarCaptionStyles()}>{t(titleKey)}</span>
              ))}
            {items.map(({ labelKey, ...item }) => (
              <UINavItem
                key={item.to}
                {...item}
                label={t(labelKey)}
                count={counts?.[item.to]}
                collapsed={collapsed}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className={sidebarUserStyles({ collapsed })}>
        <div
          title={collapsed ? user.name : undefined}
          className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-blue/50"
        >
          <span className="text-sm font-bold text-white">{user.initials}</span>
        </div>
        {collapsed ? null : (
          <>
            <div className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="truncate text-sm font-semibold text-white">{user.name}</span>
              <span className="truncate text-caption font-normal text-secondary">{user.meta}</span>
            </div>
            <UIButton
              size="icon"
              bg="transparent"
              aria-label={t('sidebar.settings')}
              onClick={onSettingsClick}
              className={sidebarSettingsStyles()}
            >
              <Settings size={17} />
            </UIButton>
          </>
        )}
      </div>
    </aside>
  );
};

export const UISidebar = memo(UISidebarBase);
