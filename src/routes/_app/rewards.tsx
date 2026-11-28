import { useState } from 'react';
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  ChallengeCard,
  CoinGrants,
  InviteCard,
  QuestCard,
  RedeemInviteForm,
  RewardsShopSoon,
} from '@/components/features/rewards';
import { useMyDailyQuests, useMyProfile, usePhoneViewport, useScrolledPast } from '@/hooks';
import {
  UICoin,
  UICollapsingHeader,
  UIPanel,
  UIQueryError,
  UISubTabs,
  UITopbar,
} from '@/ui/components';
import { formatCompactNumber } from '@/utils/numberFormat';

export const Route = createFileRoute('/_app/rewards')({ component: RewardsPage });

// as the mobile app's collapsing headers: compact once scrolled past this
const HEADER_COMPACT_OFFSET = 24;

function RewardsPage() {
  const isPhone = usePhoneViewport();
  return isPhone ? <RewardsPhonePage /> : <RewardsDesktopPage />;
}

/** The mobile app's rewards screen: a pushed screen, one list under a pinned header. */
function RewardsPhonePage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const navigate = useNavigate();
  const { data: profile } = useMyProfile();
  const { data: quests, isPending, isError, refetch } = useMyDailyQuests();
  const [tab, setTab] = useState<'earn' | 'spend'>('earn');
  const isCompact = useScrolledPast(HEADER_COMPACT_OFFSET);
  const handleBack = () =>
    window.history.length > 1 ? router.history.back() : void navigate({ to: '/profile' });
  const handleRetry = () => void refetch();
  return (
    <div data-hide-bottom-tabs className="-mt-6 pb-10">
      <UICollapsingHeader
        title={t('rewards.title')}
        isCompact={isCompact}
        onBack={handleBack}
        backLabel={t('app.back')}
      >
        <UISubTabs
          tabs={[
            { id: 'earn', label: t('rewards.tabEarn') },
            { id: 'spend', label: t('rewards.tabSpend') },
          ]}
          value={tab}
          onChange={setTab}
          label={t('rewards.title')}
          idPrefix="rewards"
          className="gap-0 px-4"
        />
      </UICollapsingHeader>
      <div
        id="rewards-tab-panel"
        role="tabpanel"
        aria-labelledby={`rewards-tab-${tab}`}
        className="flex flex-col gap-4 pt-2"
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-detail text-secondary">{t('rewards.balance')}</p>
          <p className="flex items-center gap-2">
            <UICoin className="size-7" />
            <span className="text-[30px] leading-none font-bold tracking-[-1px] text-amber tabular-nums">
              {formatCompactNumber(profile?.coins ?? 0, i18n.resolvedLanguage)}
            </span>
          </p>
        </div>
        <InviteCard />
        <RedeemInviteForm />
        {tab === 'spend' ? (
          <RewardsShopSoon />
        ) : (
          <>
            {isPending ? (
              <div
                role="status"
                aria-label={t('apiState.loading')}
                className="h-45 animate-pulse rounded-2xl bg-white-5"
              />
            ) : isError ? (
              <UIQueryError retry={handleRetry} />
            ) : (
              <QuestCard quests={quests} />
            )}
            <ChallengeCard />
            <h2 className="text-body font-semibold">{t('rewards.historyTitle')}</h2>
            <div className="-mt-3">
              <CoinGrants />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RewardsDesktopPage() {
  const { t, i18n } = useTranslation();
  const { data: profile } = useMyProfile();
  const { data: quests, isPending, isError, refetch } = useMyDailyQuests();
  const [tab, setTab] = useState<'earn' | 'spend'>('earn');

  return (
    <div className="flex h-[calc(100svh-136px)] min-h-0 flex-col lg:h-[calc(100svh-56px)]">
      <UITopbar title={t('rewards.title')}>
        {/* on a phone, the app's balance block: the label above a large amber amount */}
        <p className="flex items-center gap-2 text-detail text-secondary max-lg:flex-col max-lg:items-start max-lg:gap-0.5">
          {t('rewards.balance')}
          <span className="flex items-center gap-2">
            <UICoin className="size-6 max-lg:size-7" />
            <span className="text-section font-semibold text-white tabular-nums max-lg:text-[30px] max-lg:leading-none max-lg:font-bold max-lg:tracking-[-1px] max-lg:text-amber">
              {formatCompactNumber(profile?.coins ?? 0, i18n.resolvedLanguage)}
            </span>
          </span>
        </p>
      </UITopbar>
      <UISubTabs
        tabs={[
          { id: 'earn', label: t('rewards.tabEarn') },
          { id: 'spend', label: t('rewards.tabSpend') },
        ]}
        value={tab}
        onChange={setTab}
        label={t('rewards.title')}
        idPrefix="rewards"
        className="mb-5 shrink-0 max-lg:mb-3"
      />
      <div
        id="rewards-tab-panel"
        role="tabpanel"
        aria-labelledby={`rewards-tab-${tab}`}
        className="flex min-h-0 flex-1 flex-col max-lg:overflow-y-auto"
      >
        {tab === 'spend' ? (
          <RewardsShopSoon />
        ) : (
          <div className="grid min-h-0 flex-1 items-start gap-5 max-lg:flex-none max-lg:gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
            {/* on a phone, the app's order: invite and redeem cards above the quests */}
            <div className="space-y-5 max-lg:flex max-lg:flex-col max-lg:gap-4 max-lg:space-y-0">
              {isPending ? (
                <p role="status">{t('apiState.loading')}</p>
              ) : isError ? (
                <UIQueryError retry={() => void refetch()} />
              ) : (
                <QuestCard quests={quests} />
              )}
              <ChallengeCard />
              <InviteCard />
              <RedeemInviteForm />
            </div>
            {/* on a phone, a plain list under the cards with its own scroll height, as the app shows it */}
            <UIPanel className="flex h-full min-h-0 flex-col max-lg:h-[70svh] max-lg:rounded-none max-lg:border-0 max-lg:bg-transparent max-lg:p-0 max-lg:before:hidden">
              <h2 className="text-section font-semibold max-lg:text-body">
                {t('rewards.historyTitle')}
              </h2>
              <CoinGrants />
            </UIPanel>
          </div>
        )}
      </div>
    </div>
  );
}
