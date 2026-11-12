import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FaqList, FaqProposalDialog, FaqProposals } from '@/components/features/faq';
import { UIButton, UISegmented, UITopbar } from '@/ui/components';

export const Route = createFileRoute('/_app/faq')({ component: FAQPage });

function FAQPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'all' | 'mine'>('all');
  const [isProposing, setIsProposing] = useState(false);
  const tabs: string[] = [t('faq.allQuestions'), t('faq.myProposals')];

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
          value={tabs[tab === 'all' ? 0 : 1]}
          onChange={(value) => setTab(tabs.indexOf(value) === 0 ? 'all' : 'mine')}
        />
      </div>
      {tab === 'all' ? <FaqList /> : <FaqProposals />}
      <FaqProposalDialog open={isProposing} onClose={() => setIsProposing(false)} />
    </div>
  );
}
