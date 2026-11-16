import { AuthLayout } from '@/components';
import { Outlet, Link, createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useNarrowViewport } from '@/hooks';
import { isMobileDevice, shouldBlockMobile } from '@/utils';
import { UIDialog } from '@/ui/components';

import { privateRouteHead } from '@/utils/routeHead';

export const Route = createFileRoute('/(auth)')({
  head: ({ matches }) => privateRouteHead(matches[matches.length - 1]!.pathname),
  component: AuthRoute,
});

function AuthRoute() {
  const { t } = useTranslation();
  const narrow = useNarrowViewport();
  const blocked = shouldBlockMobile(
    isMobileDevice(navigator.userAgent, navigator.platform, navigator.maxTouchPoints),
    narrow,
  );

  return (
    <AuthLayout>
      {blocked ? (
        <UIDialog
          open
          dismissible={false}
          title={t('app.mobileTitle')}
          description={t('app.mobileDescription')}
          className="bg-blue"
        >
          <Link
            to="/"
            data-ph-capture-attribute-label={t('app.home')}
            className="mt-6 inline-block text-sm underline"
          >
            {t('app.home')}
          </Link>
        </UIDialog>
      ) : (
        <Outlet />
      )}
    </AuthLayout>
  );
}
