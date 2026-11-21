import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FaqList, FaqPending, FaqProposalDialog, FaqProposals } from '@/components/features/faq';
import { usePendingFaqProposals } from '@/hooks';
import { UIButton, UISegmented, UITopbar } from '@/ui/components';

export const Route = createFileRoute('/_app/faq')({ component: FAQPage });

function FAQPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'all' | 'mine' | 'pending'>('all');
  const [isProposing, setIsProposing] = useState(false);
  // A 403 from the pending list means the student isn't a moderator, so the tab stays hidden.
  const { data: pending } = usePendingFaqProposals();
  const tabIds = pending ? (['all', 'mine', 'pending'] as const) : (['all', 'mine'] as const);
  const tabLabels = {
    all: t('faq.allQuestions'),
    mine: t('faq.myProposals'),
    pending: t('faq.pending'),
  };
  const tabs: string[] = tabIds.map((id) => tabLabels[id]);

  return (
    <div className="flex h-[calc(100svh-136px)] min-h-0 flex-col lg:h-[calc(100svh-56px)]">
      <UITopbar title={t('faq.title')}>
        <UIButton
          size="sm"
          leftIcon={Plus}
          onClick={() => setIsProposing(true)}
          className="h-9 min-h-9 shrink-0 px-3 py-0 text-detail whitespace-nowrap"
        >
          {t('faq.propose')}
        </UIButton>
      </UITopbar>
      <div className="mb-4 shrink-0">
        <UISegmented
          label={t('faq.title')}
          options={tabs}
          value={tabLabels[tab]}
          onChange={(value) => setTab(tabIds[tabs.indexOf(value)] ?? 'all')}
        />
      </div>
      {tab === 'all' ? <FaqList /> : tab === 'mine' ? <FaqProposals /> : <FaqPending />}
      <FaqProposalDialog open={isProposing} onClose={() => setIsProposing(false)} />
    </div>
  );
}
