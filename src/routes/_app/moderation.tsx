import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { ModerationTab } from '@/@types';
import { FaqPending } from '@/components/features/faq';
import {
  ChallengeAdmin,
  ImageQueue,
  ModerationLog,
  ModeratorList,
  ReportQueue,
} from '@/components/features/moderation';
import { myProfileQueryOptions, useMyProfile } from '@/hooks';
import { moderationSearchSchema } from '@/schemas';
import { UISubTabs, UITopbar } from '@/ui/components';
import { isAdmin, isStaff } from '@/utils';

export const Route = createFileRoute('/_app/moderation')({
  validateSearch: (search: Record<string, unknown>) => moderationSearchSchema.parse(search),
  // Students never see the moderation tools; the backend answers them 403 anyway.
  beforeLoad: async ({ context }) => {
    const profile = await context.queryClient.ensureQueryData(myProfileQueryOptions());
    if (!isStaff(profile)) throw redirect({ to: '/feed', replace: true });
  },
  component: ModerationPage,
});

function ModerationPage() {
  const { t } = useTranslation();
  const { data: me } = useMyProfile();
  const navigate = useNavigate({ from: '/moderation' });
  const admin = isAdmin(me);
  const tabIds: readonly ModerationTab[] = admin
    ? ['reports', 'images', 'faq', 'moderators', 'log', 'challenges']
    : ['reports', 'images', 'faq'];
  // Moderators only get their own tabs, whatever the URL asks for.
  const { tab: requested = 'reports' } = Route.useSearch();
  const tab: ModerationTab = tabIds.includes(requested) ? requested : 'reports';
  const tabLabels = {
    reports: t('moderation.reports'),
    images: t('moderation.images'),
    faq: t('faq.title'),
    moderators: t('moderation.moderators'),
    log: t('moderation.log'),
    challenges: t('moderation.challenges'),
  };

  return (
    <div className="flex h-[calc(100svh-136px)] min-h-0 flex-col lg:h-[calc(100svh-56px)]">
      <UITopbar title={t('moderation.title')} />
      <UISubTabs
        tabs={tabIds.map((id) => ({ id, label: tabLabels[id] }))}
        value={tab}
        onChange={(next) =>
          void navigate({ search: { tab: next === 'reports' ? undefined : next }, replace: true })
        }
        label={t('moderation.title')}
        idPrefix="moderation"
        className="mb-4 shrink-0 max-lg:scrollbar-hidden max-lg:gap-4 max-lg:overflow-x-auto max-lg:[&>button]:whitespace-nowrap"
      />
      <div
        id="moderation-tab-panel"
        role="tabpanel"
        aria-labelledby={`moderation-tab-${tab}`}
        className="flex min-h-0 flex-1 flex-col"
      >
        {tab === 'reports' ? (
          <ReportQueue />
        ) : tab === 'images' ? (
          <ImageQueue />
        ) : tab === 'faq' ? (
          <FaqPending />
        ) : tab === 'moderators' ? (
          <ModeratorList />
        ) : tab === 'log' ? (
          <ModerationLog />
        ) : (
          <ChallengeAdmin />
        )}
      </div>
    </div>
  );
}
