import { BrandBackground, UIBottomTabs, UIDialog, UISidebar } from '@/ui/components';
import { Outlet, createFileRoute, Link, retainSearchParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import { useNarrowViewport } from '@/hooks/useNarrowViewport';
import { isMobileDevice, optionalSearchString, shouldBlockMobile } from '@/utils';
import { APP_STORES } from '@/utils/stores';
export const Route = createFileRoute('/_app')({
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    conversationId?: string;
    chatType?: 'groups' | 'connections' | undefined;
    chatRoute?: 'new-group' | undefined;
    postId?: string;
    feedRoute?: 'new-post';
  } => {
    const conversationId = optionalSearchString(search.conversationId);
    const postId = optionalSearchString(search.postId);
    const feedRoute = search.feedRoute === 'new-post' ? search.feedRoute : undefined;
    const chatType =
      search.chatType === 'groups' || search.chatType === 'connections'
        ? search.chatType
        : undefined;
    const chatRoute = search.chatRoute === 'new-group' ? search.chatRoute : undefined;
    return {
      ...(chatType ? { chatType } : {}),
      ...(conversationId ? { conversationId } : {}),
      ...(chatRoute ? { chatRoute } : {}),
      ...(postId ? { postId } : {}),
      ...(feedRoute ? { feedRoute } : {}),
    };
  },
  search: {
    middlewares: [
      retainSearchParams(['chatType', 'conversationId', 'chatRoute', 'postId', 'feedRoute']),
    ],
  },
  component: AppLayout,
});

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
      <Toaster
        position="top-right"
        gutter={10}
        containerStyle={{ top: 24, right: 24 }}
        toastOptions={{
          duration: 3500,
          style: {
            maxWidth: 'calc(100vw - 32px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 16,
            background: 'rgba(22, 24, 34, 0.96)',
            padding: '12px 16px',
            color: '#fff',
            fontFamily: 'Geist Variable, sans-serif',
            fontSize: 14,
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.28)',
          },
          success: { duration: 3000, iconTheme: { primary: '#3dd68c', secondary: '#161822' } },
          error: { iconTheme: { primary: '#e5484d', secondary: '#fff' } },
        }}
      />
    </BrandBackground>
  );
}
