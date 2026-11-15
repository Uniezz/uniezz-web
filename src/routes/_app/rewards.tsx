import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { CoinGrants, QuestCard, RewardsShopSoon } from '@/components/features/rewards';
import { useMyDailyQuests, useMyProfile } from '@/hooks';
import { UICoin, UIPanel, UIQueryError, UISubTabs, UITopbar } from '@/ui/components';

export const Route = createFileRoute('/_app/rewards')({ component: RewardsPage });

function RewardsPage() {
  const { t } = useTranslation();
  const { data: profile } = useMyProfile();
  const { data: quests, isPending, isError, refetch } = useMyDailyQuests();
  const [tab, setTab] = useState<'earn' | 'spend'>('earn');

  return (
    <div className="flex h-[calc(100svh-136px)] min-h-0 flex-col lg:h-[calc(100svh-56px)]">
      <UITopbar title={t('rewards.title')}>
        <p className="flex items-center gap-2 text-detail text-secondary">
          {t('rewards.balance')}
          <UICoin className="size-6" />
          <span className="text-section font-semibold text-white tabular-nums">
            {profile?.coins ?? 0}
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
        className="mb-5 shrink-0"
      />
      <div
        id="rewards-tab-panel"
        role="tabpanel"
        aria-labelledby={`rewards-tab-${tab}`}
        className="flex min-h-0 flex-1 flex-col"
      >
        {tab === 'spend' ? (
          <RewardsShopSoon />
        ) : (
          <div className="grid min-h-0 flex-1 items-start gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
            {isPending ? (
              <p role="status">{t('apiState.loading')}</p>
            ) : isError ? (
              <UIQueryError retry={() => void refetch()} />
            ) : (
              <QuestCard quests={quests} />
            )}
            <UIPanel className="flex h-full min-h-0 flex-col">
              <h2 className="text-section font-semibold">{t('rewards.historyTitle')}</h2>
              <CoinGrants />
            </UIPanel>
          </div>
        )}
      </div>
    </div>
  );
}
