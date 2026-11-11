import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';

import { defaultConnectionFilters } from '@/utils';
import type { ConnectionFilters } from '@/@types';
import { UITopbar } from '@/ui/components';
import { DiscoveryProfile, ConnectionFilterPanel } from '@/components/features/connections';

export const Route = createFileRoute('/_app/connections/')({ component: ConnectionsPage });
function ConnectionsPage() {
  const { t } = useTranslation();
  const filters = useForm<ConnectionFilters>({ defaultValues: defaultConnectionFilters });
  const values = { ...defaultConnectionFilters, ...useWatch({ control: filters.control }) };
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
          <DiscoveryProfile filters={values as ConnectionFilters} />
        </div>
        <aside className="relative">
          <ConnectionFilterPanel form={filters} />
        </aside>
      </div>
    </>
  );
}
