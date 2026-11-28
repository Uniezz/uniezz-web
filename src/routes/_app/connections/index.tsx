import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { defaultConnectionFilters } from '@/utils';
import type { ConnectionFilters } from '@/@types';
import { useMyConnectionPreferences, usePhoneViewport } from '@/hooks';
import { UIButton, UIDialog, UITopbar } from '@/ui/components';
import {
  BirthDatePrompt,
  ConnectionFilterPanel,
  DiscoveryProfile,
  MeetScreen,
} from '@/components/features/connections';

export const Route = createFileRoute('/_app/connections/')({ component: ConnectionsPage });
function ConnectionsPage() {
  const isPhone = usePhoneViewport();
  // on a phone, the mobile app's Meet tab
  return isPhone ? <MeetScreen /> : <DesktopConnectionsPage />;
}

function DesktopConnectionsPage() {
  const { t } = useTranslation();
  const { data: preferences } = useMyConnectionPreferences();
  const savedFilters: ConnectionFilters = {
    ...defaultConnectionFilters,
    mode: preferences?.openTo?.[0] ?? defaultConnectionFilters.mode,
  };
  const filters = useForm<ConnectionFilters>({
    values: savedFilters,
    resetOptions: { keepDirtyValues: true },
  });
  const [appliedFilters, setAppliedFilters] = useState<ConnectionFilters>();
  const discoveryFilters = appliedFilters ?? savedFilters;
  // On a phone the filters open in a dialog, like the app's filter sheet, instead of a panel beside the card.
  const [filtersOpen, setFiltersOpen] = useState(false);
  const applyFromDialog = (applied: ConnectionFilters) => {
    setAppliedFilters(applied);
    setFiltersOpen(false);
  };
  return (
    <>
      <UITopbar title={t('connections.title')} subtitle={t('connections.subtitle')}>
        <Link
          to="/connections/students"
          search={{ studentSearch: undefined }}
          data-ph-capture-attribute-label={t('students.allStudents')}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white-10 bg-white-5 px-4 text-label font-semibold transition-colors hover:bg-white-10 focus-visible:outline-2 focus-visible:outline-blue"
        >
          {t('students.allStudents')}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
        <UIButton
          size="pill"
          bg="secondary"
          leftIcon={SlidersHorizontal}
          className="lg:hidden"
          onClick={() => setFiltersOpen(true)}
        >
          {t('connections.filters')}
        </UIButton>
      </UITopbar>
      <div className="grid items-start gap-6 xl:grid-cols-[620px_minmax(0,1fr)] xl:items-stretch">
        <div className="min-w-0 space-y-4">
          <DiscoveryProfile filters={discoveryFilters} />
        </div>
        <aside className="relative max-lg:hidden">
          <ConnectionFilterPanel form={filters} onApply={setAppliedFilters} />
        </aside>
      </div>
      <UIDialog
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        title={t('connections.filters')}
        description={t('connections.subtitle')}
        className="lg:hidden"
      >
        <ConnectionFilterPanel
          form={filters}
          onApply={applyFromDialog}
          className="border-0 bg-transparent p-0 before:hidden"
        />
      </UIDialog>
      <BirthDatePrompt />
    </>
  );
}
