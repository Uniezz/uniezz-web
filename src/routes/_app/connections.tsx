import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';

// TODO(api): Replace mock discovery defaults and local actions with API data and mutations.
import { CONNECTIONSMOCKS } from '@/utils';
import type { ConnectionFilters } from '@/@types';
import { UISegmented, UITopbar } from '@/ui/components';
import {
  DiscoveryProfile,
  DiscoveryActions,
  ConnectionFilterPanel,
} from '@/components/features/connections';

export const Route = createFileRoute('/_app/connections')({ component: ConnectionsPage });
function ConnectionsPage() {
  const { t } = useTranslation();
  const [passed, setPassed] = useState(false);
  const [connected, setConnected] = useState(false);
  const filters = useForm<ConnectionFilters>({ defaultValues: CONNECTIONSMOCKS.defaultFilters });
  const { universities = [], years, mode = 'friends' } = useWatch({ control: filters.control });
  const showProfile = !passed && universities.includes('UMCS') && years === true;
  const modes = [
    { value: 'friends', label: t('app.friends') },
    { value: 'studyBuddy', label: t('app.studyBuddy') },
    { value: 'dating', label: t('app.dating') },
  ] as const;
  return (
    <>
      <UITopbar title={t('connections.title')} subtitle={t('connections.subtitle')}>
        <Link
          to="/students"
          search={{ studentSearch: undefined }}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white-10 bg-white-5 px-4 text-label font-semibold transition-colors hover:bg-white-10 focus-visible:outline-2 focus-visible:outline-blue"
        >
          {t('students.allStudents')}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </UITopbar>
      <div className="grid items-start gap-6 xl:grid-cols-[620px_minmax(0,1fr)]">
        <div className="min-w-0 space-y-4">
          <UISegmented
            options={modes.map((option) => option.label)}
            value={modes.find((option) => option.value === mode)!.label}
            onChange={(label) => {
              const option = modes.find((option) => option.label === label);
              if (option) filters.setValue('mode', option.value);
            }}
            label={t('connections.title')}
          />
          <DiscoveryProfile
            showProfile={showProfile}
            onReset={() => {
              setPassed(false);
              filters.reset({ ...CONNECTIONSMOCKS.defaultFilters, mode });
            }}
          />
        </div>
        <aside className="space-y-5">
          <DiscoveryActions
            showProfile={showProfile}
            connected={connected}
            onPass={() => setPassed(true)}
            onConnect={() => setConnected((value) => !value)}
          />
          <ConnectionFilterPanel form={filters} />
        </aside>
      </div>
    </>
  );
}
