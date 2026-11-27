import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FaqList, FaqPending, FaqProposalDialog, FaqProposals } from '@/components/features/faq';
import { usePendingFaqProposals } from '@/hooks';
import { UIButton, UISubTabs, UITopbar } from '@/ui/components';

export const Route = createFileRoute('/_app/faq')({ component: FAQPage });

function FAQPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'all' | 'mine' | 'pending'>('all');
  const [isProposing, setIsProposing] = useState(false);
  // A 403 from the pending list means the student isn't a moderator, so the tab stays hidden.
  const { data: pending } = usePendingFaqProposals();
  const tabs = [
    { id: 'all' as const, label: t('faq.allQuestions') },
    { id: 'mine' as const, label: t('faq.myProposals') },
    ...(pending ? [{ id: 'pending' as const, label: t('faq.pending') }] : []),
  ];

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
      <UISubTabs
        tabs={tabs}
        value={tab}
        onChange={setTab}
        label={t('faq.title')}
        idPrefix="faq"
        className="mb-4 shrink-0"
      />
      <div
        id="faq-tab-panel"
        role="tabpanel"
        aria-labelledby={`faq-tab-${tab}`}
        className="flex min-h-0 flex-1 flex-col"
      >
        {tab === 'all' ? <FaqList /> : tab === 'mine' ? <FaqProposals /> : <FaqPending />}
      </div>
      <FaqProposalDialog open={isProposing} onClose={() => setIsProposing(false)} />
    </div>
  );
}
