import { BrandBackground, UIBottomTabs, UIDialog, UISidebar } from '@/ui/components';
import { Outlet, createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useNarrowViewport } from '@/hooks/useNarrowViewport';
import { isMobileDevice, shouldBlockMobile } from '@/utils';
import { APP_STORES } from '@/utils/stores';
export const Route = createFileRoute('/_app')({ component: AppLayout });
function AppLayout() {
  const { t } = useTranslation();
  const narrow = useNarrowViewport();
  const blocked = shouldBlockMobile(
    isMobileDevice(navigator.userAgent, navigator.platform, navigator.maxTouchPoints),
    narrow,
  );
  return (
    <BrandBackground variant="app" className="flex min-h-svh">
      <UISidebar
        className="sticky top-0 hidden h-svh lg:flex"
        user={{ initials: 'JK', name: 'Jan Kowalski', meta: 'UMCS · 3rd year' }}
        counts={{ '/chat': 2, '/connections': 2 }}
      />
      <main className="min-w-0 flex-1 px-4 py-6 pb-28 sm:px-7 lg:px-10 lg:py-7 lg:pb-7">
        {blocked ? null : <Outlet />}
        <UIBottomTabs />
      </main>
      <UIDialog
        open={blocked}
        dismissible={false}
        title={t('app.mobileTitle')}
        description={t('app.mobileDescription')}
        className="bg-blue"
      >
        <div className="flex flex-wrap gap-3">
          {APP_STORES.map((store) => (
            <button
              key={store.name}
              disabled
              className="flex flex-1 items-center gap-3 rounded-2xl border border-white/30 bg-ink/20 p-4 text-left"
            >
              <svg viewBox="0 0 24 24" className="size-8 shrink-0 fill-white" aria-hidden>
                <path d={store.path} />
              </svg>
              <span>
                <span className="block text-xs tracking-widest uppercase">
                  {t('landing.appsSoon')}
                </span>
                <strong className="text-lg whitespace-nowrap">{store.name}</strong>
              </span>
            </button>
          ))}
        </div>
        <Link to="/" className="mt-6 inline-block text-sm underline">
          {t('app.home')}
        </Link>
      </UIDialog>
    </BrandBackground>
  );
}
