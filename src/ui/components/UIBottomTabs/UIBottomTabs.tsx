import {
  bottomTabsStyles,
  bottomTabStyles,
  bottomTabLabelStyles,
  bottomTabStateStyles,
} from './variants';
import { Link, useMatchRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { NAV_GROUPS, RESET_TAB_SEARCH } from '@/utils/navigation';
export const UIBottomTabs = () => {
  const { t } = useTranslation();
  const matchRoute = useMatchRoute();
  return (
    <nav aria-label={t('sidebar.mainNavigation')} className={bottomTabsStyles()}>
      {NAV_GROUPS.flatMap((g) => g.items).map(({ to, labelKey, leftIcon: Icon }) => (
        <Link
          key={to}
          to={to}
          search={matchRoute({ to, fuzzy: true }) ? ((() => RESET_TAB_SEARCH) as never) : undefined}
          activeProps={{ className: bottomTabStateStyles({ active: true }) }}
          inactiveProps={{ className: bottomTabStateStyles({ active: false }) }}
          className={bottomTabStyles()}
        >
          <Icon size={19} />
          <span className={bottomTabLabelStyles()}>{t(labelKey)}</span>
        </Link>
      ))}
    </nav>
  );
};
