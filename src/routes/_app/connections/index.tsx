import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';

// TODO(api): Replace mock discovery defaults and local actions with API data and mutations.
import { CONNECTIONSMOCKS, matchesConnectionFilters } from '@/utils';
import type { ConnectionFilters } from '@/@types';
import { UITopbar } from '@/ui/components';
import { useMyProfile } from '@/hooks';
import {
  DiscoveryProfile,
  DiscoveryActions,
  ConnectionFilterPanel,
} from '@/components/features/connections';

export const Route = createFileRoute('/_app/connections/')({ component: ConnectionsPage });
function ConnectionsPage() {
  const { t } = useTranslation();
  const [passed, setPassed] = useState(false);
  const [connected, setConnected] = useState(false);
  const [leaving, setLeaving] = useState<'left' | 'right' | null>(null);
  // Swipes the card away first; without motion there's no animationend, so move on at once.
  const leave = (direction: 'left' | 'right') => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) setPassed(true);
    else setLeaving(direction);
  };
  const { data: me } = useMyProfile();
  const filters = useForm<ConnectionFilters>({ defaultValues: CONNECTIONSMOCKS.defaultFilters });
  const values = { ...CONNECTIONSMOCKS.defaultFilters, ...useWatch({ control: filters.control }) };
  const { mode } = values;
  const showProfile =
    !passed &&
    matchesConnectionFilters(
      values as ConnectionFilters,
      CONNECTIONSMOCKS.candidate,
      me?.interests ?? [],
    );
  return (
    <>
      <UITopbar title={t('connections.title')} subtitle={t('connections.subtitle')}>
        <Link
          to="/connections/students"
          search={{ studentSearch: undefined }}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white-10 bg-white-5 px-4 text-label font-semibold transition-colors hover:bg-white-10 focus-visible:outline-2 focus-visible:outline-blue"
        >
          {t('students.allStudents')}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </UITopbar>
      <div className="grid items-start gap-6 xl:grid-cols-[620px_minmax(0,1fr)] xl:items-stretch">
        <div className="min-w-0 space-y-4">
          <DiscoveryProfile
            showProfile={showProfile}
            leaving={leaving}
            onLeft={() => {
              setPassed(true);
              setLeaving(null);
            }}
            onReset={() => {
              setPassed(false);
              filters.reset({ ...CONNECTIONSMOCKS.defaultFilters, mode });
            }}
          >
            <DiscoveryActions
              showProfile={showProfile && !leaving}
              connected={connected}
              onPass={() => leave('left')}
              onConnect={() => {
                setConnected(true);
                leave('right');
              }}
            />
          </DiscoveryProfile>
        </div>
        <aside className="relative">
          <ConnectionFilterPanel form={filters} />
        </aside>
      </div>
    </>
  );
}
