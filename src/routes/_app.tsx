import { BrandBackground, UIBottomTabs, UIDialog, UISidebar } from '@/ui/components';
import {
  Outlet,
  createFileRoute,
  Link,
  redirect,
  retainSearchParams,
} from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useMyProfile } from '@/hooks';
import { myProfileQueryOptions } from '@/hooks';
import { ApiRequestError } from '@/api';
import { authorName } from '@/utils';
import { useNarrowViewport } from '@/hooks';
import { isMobileDevice, shouldBlockMobile } from '@/utils';
import { optionalSearchStringSchema, returnPathSchema } from '@/schemas';
import { AppStoreLinks } from '@/components';
import { privateRouteHead } from '@/utils/routeHead';

export const Route = createFileRoute('/_app')({
  head: ({ matches }) => privateRouteHead(matches[matches.length - 1]!.pathname),
  // Runs on every visit to a closed page, including Back. A guest goes to sign-in
  // with `replace`, so the closed page is not kept in history.
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(myProfileQueryOptions());
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        throw redirect({ to: '/login', replace: true });
      }
      throw error;
    }
  },
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    conversationId?: string;
    chatType?: 'groups' | 'connections' | undefined;
    /** Where the open post was opened from, so returning from it keeps its Back. */
    postFrom?: string;
  } => {
    const conversationId = optionalSearchStringSchema.parse(search.conversationId);
    const postFrom = returnPathSchema.parse(search.postFrom);
    const chatType =
      search.chatType === 'groups' || search.chatType === 'connections'
        ? search.chatType
        : undefined;
    return {
      ...(chatType ? { chatType } : {}),
      ...(conversationId ? { conversationId } : {}),
      ...(postFrom ? { postFrom } : {}),
    };
  },
  search: {
    middlewares: [retainSearchParams(['chatType', 'conversationId', 'postFrom'])],
  },
  component: AppLayout,
});

function AppLayout() {
  const { t } = useTranslation();
  const narrow = useNarrowViewport();
  const { data: profile } = useMyProfile();
  const blocked = shouldBlockMobile(
    isMobileDevice(navigator.userAgent, navigator.platform, navigator.maxTouchPoints),
    narrow,
  );
  return (
    <>
      <BrandBackground variant="app" className="app-shell-background flex min-h-svh">
        <UISidebar
          className="sticky top-0 hidden h-svh lg:flex"
          user={{
            initials: '',
            name: authorName(profile) || t('app.profile'),
            meta: profile?.universityId.toUpperCase() ?? '',
            avatar: profile?.avatarUrl ?? '/app/avatar.png',
            coins: profile?.coins,
          }}
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
          <AppStoreLinks />
          <Link
            to="/"
            data-ph-capture-attribute-label={t('app.home')}
            className="mt-6 inline-block text-sm underline"
          >
            {t('app.home')}
          </Link>
        </UIDialog>
      </BrandBackground>
    </>
  );
}
