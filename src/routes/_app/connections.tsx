import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
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
        <UISegmented
          options={modes.map((option) => option.label)}
          value={modes.find((option) => option.value === mode)!.label}
          onChange={(label) => {
            const option = modes.find((option) => option.label === label);
            if (option) filters.setValue('mode', option.value);
          }}
          label={t('connections.title')}
        />
      </UITopbar>
      <div className="grid items-start gap-6 xl:grid-cols-[620px_minmax(0,1fr)]">
        <DiscoveryProfile
          showProfile={showProfile}
          onReset={() => {
            setPassed(false);
            filters.reset({ ...CONNECTIONSMOCKS.defaultFilters, mode });
          }}
        />
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
