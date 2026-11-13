import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { defaultConnectionFilters } from '@/utils';
import type { ConnectionFilters } from '@/@types';
import { useMyConnectionPreferences } from '@/hooks';
import { UITopbar } from '@/ui/components';
import { ConnectionFilterPanel, DiscoveryProfile } from '@/components/features/connections';

export const Route = createFileRoute('/_app/connections/')({ component: ConnectionsPage });
function ConnectionsPage() {
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
      </UITopbar>
      <div className="grid items-start gap-6 xl:grid-cols-[620px_minmax(0,1fr)] xl:items-stretch">
        <div className="min-w-0 space-y-4">
          <DiscoveryProfile filters={discoveryFilters} />
        </div>
        <aside className="relative">
          <ConnectionFilterPanel form={filters} onApply={setAppliedFilters} />
        </aside>
      </div>
    </>
  );
}
