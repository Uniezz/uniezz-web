import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { MessageCirclePlus, Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  FaqList,
  FaqPending,
  FaqPhoneEntries,
  FaqPhoneProposals,
  FaqProposalDialog,
  FaqProposals,
} from '@/components/features/faq';
import { usePendingFaqProposals, usePhoneViewport, useScrolledPast } from '@/hooks';
import { UIButton, UISearchOverlay, UISubTabs, UITopbar } from '@/ui/components';
import { HEADER_COMPACT_OFFSET } from '@/utils';

export const Route = createFileRoute('/_app/faq')({ component: FAQPage });

function FAQPage() {
  const isPhone = usePhoneViewport();
  return isPhone ? <FaqPhonePage /> : <FaqDesktopPage />;
}

/** The mobile app's FAQ tab: search and suggest in the header, the sub-tabs pinned under it. */
function FaqPhonePage() {
  const { t } = useTranslation();
  // moderation is web-only, so a phone shows no Pending tab
  const [tab, setTab] = useState<'all' | 'mine'>('all');
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProposing, setIsProposing] = useState(false);
  const isCompact = useScrolledPast(HEADER_COMPACT_OFFSET);
  const handleSearchOpen = () => setIsSearchOpen(true);
  const handleSearchClose = () => setIsSearchOpen(false);
  const handleProposeOpen = () => setIsProposing(true);
  const handleProposeClose = () => setIsProposing(false);

  return (
    <>
      <UITopbar
        sticky
        title={t('tabs.faq')}
        compact={isCompact}
        phoneActions={
          <>
            <UIButton
              size="square"
              bg="glass"
              aria-label={t('faq.search')}
              data-ph-capture-attribute-label="Search FAQ"
              onClick={handleSearchOpen}
            >
              <Search size={18} aria-hidden="true" />
            </UIButton>
            <UIButton
              size="square"
              bg="glass"
              aria-label={t('faq.propose')}
              data-ph-capture-attribute-label="Suggest a question"
              onClick={handleProposeOpen}
            >
              <MessageCirclePlus size={18} aria-hidden="true" />
            </UIButton>
          </>
        }
      >
        <UISubTabs
          tabs={[
            { id: 'all' as const, label: t('faq.allQuestions') },
            { id: 'mine' as const, label: t('faq.myProposals') },
          ]}
          value={tab}
          onChange={setTab}
          label={t('faq.title')}
          idPrefix="faq"
          className="-mx-4 w-[calc(100%+2rem)] gap-0 px-4"
        />
      </UITopbar>
      <div id="faq-tab-panel" role="tabpanel" aria-labelledby={`faq-tab-${tab}`}>
        {tab === 'all' ? (
          <FaqPhoneEntries search={search} />
        ) : (
          <FaqPhoneProposals search={search} />
        )}
      </div>
      <UISearchOverlay
        isOpen={isSearchOpen}
        value={search}
        onChangeText={setSearch}
        onSubmit={handleSearchClose}
        onClose={handleSearchClose}
        placeholder={t('faq.search')}
        submitLabel={t('topbar.search')}
      />
      <FaqProposalDialog open={isProposing} onClose={handleProposeClose} />
    </>
  );
}

function FaqDesktopPage() {
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
        className="mb-4 shrink-0 max-lg:mb-3"
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
