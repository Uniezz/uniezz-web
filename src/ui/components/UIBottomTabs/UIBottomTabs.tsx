import { useFeatureFlagEnabled } from '@posthog/react';
import {
  bottomTabsStyles,
  bottomTabsBarStyles,
  bottomTabStyles,
  bottomTabBadgeStyles,
  bottomTabLabelStyles,
  bottomTabStateStyles,
} from './variants';
import { Link, useMatchRoute } from '@tanstack/react-router';
import { type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useChatUnread } from '@/hooks';
import { getBottomTabs, RESET_TAB_SEARCH } from '@/utils';
export type UIBottomTabsProps = {
  /** Runs before a tab navigates; `event.preventDefault()` keeps the current tab, as a disabled tab. */
  onTabClick?: (to: string, event: MouseEvent<HTMLAnchorElement>) => void;
};
export const UIBottomTabs = ({ onTabClick }: UIBottomTabsProps = {}) => {
  const { t } = useTranslation();
  const matchRoute = useMatchRoute();
  const chatEnabled = useFeatureFlagEnabled('chat') === true;
  const tabs = getBottomTabs(chatEnabled);
  const { data: unread } = useChatUnread(chatEnabled);
  const unreadCount = unread?.totalUnread ?? 0;
  return (
    // the mobile app's floating glass tab bar
    <nav aria-label={t('sidebar.mainNavigation')} className={bottomTabsStyles()}>
      <div className={bottomTabsBarStyles()}>
        {tabs.map(({ to, labelKey, leftIcon: Icon }) => {
          const badge = to === '/chat' && unreadCount > 0 ? unreadCount : undefined;
          return (
            <Link
              key={to}
              to={to}
              search={
                matchRoute({ to, fuzzy: true }) ? ((() => RESET_TAB_SEARCH) as never) : undefined
              }
              activeProps={{ className: bottomTabStateStyles({ active: true }) }}
              inactiveProps={{ className: bottomTabStateStyles({ active: false }) }}
              data-ph-capture-attribute-label={t(labelKey)}
              aria-label={badge ? `${t(labelKey)}, ${badge}` : undefined}
              onClick={onTabClick ? (event) => onTabClick(to, event) : undefined}
              className={bottomTabStyles()}
            >
              <span className="relative">
                <Icon size={20} />
                {badge && (
                  <span aria-hidden className={bottomTabBadgeStyles()}>
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </span>
              <span className={bottomTabLabelStyles()}>{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
