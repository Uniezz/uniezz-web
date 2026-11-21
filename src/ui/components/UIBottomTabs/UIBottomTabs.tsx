import { cn } from '../../cn';
import { useFeatureFlagEnabled } from '@posthog/react';
import {
  bottomTabsStyles,
  bottomTabStyles,
  bottomTabLabelStyles,
  bottomTabStateStyles,
} from './variants';
import { Link, useMatchRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useMyProfile } from '@/hooks';
import { getNavigationGroups, isStaff, RESET_TAB_SEARCH } from '@/utils';
export const UIBottomTabs = () => {
  const { t } = useTranslation();
  const matchRoute = useMatchRoute();
  const { data: me } = useMyProfile();
  const navigationGroups = getNavigationGroups(useFeatureFlagEnabled('chat') === true, isStaff(me));
  return (
    <nav aria-label={t('sidebar.mainNavigation')} className={bottomTabsStyles()}>
      {navigationGroups
        .flatMap((g) => g.items)
        .map(({ to, labelKey, leftIcon: Icon, tone }) => (
          <Link
            key={to}
            to={to}
            search={
              matchRoute({ to, fuzzy: true }) ? ((() => RESET_TAB_SEARCH) as never) : undefined
            }
            activeProps={{ className: cn(bottomTabStateStyles({ active: true, tone })) }}
            inactiveProps={{ className: bottomTabStateStyles({ active: false }) }}
            data-ph-capture-attribute-label={t(labelKey)}
            className={bottomTabStyles()}
          >
            <Icon size={19} />
            <span className={bottomTabLabelStyles()}>{t(labelKey)}</span>
          </Link>
        ))}
    </nav>
  );
};
