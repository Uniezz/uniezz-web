import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Skeleton } from 'skullet/react';
import type { ConnectionFilters, DiscoveryCard } from '@/@types';
import { useCandidateAction, useDiscovery, useUniversities } from '@/hooks';
import { ReportButton } from '@/components/features/reports';
import { UIEmpty, UIPanel, UIQueryError } from '@/ui/components';
import { cn } from '@/ui/cn';
import { studyLevelLabels } from '@/utils';
import { DiscoveryActions } from './DiscoveryActions';

const panelClass =
  'relative flex min-h-100 flex-col overflow-hidden rounded-feature p-0 xl:h-[calc(100svh-9.5rem)] xl:min-h-140';

export type DiscoveryProfileProps = { filters: ConnectionFilters };

export function DiscoveryProfile({ filters }: DiscoveryProfileProps) {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch } = useDiscovery(filters);
  const { mutate: act, isPending: isActing } = useCandidateAction();
  const [leaving, setLeaving] = useState<{ id: string; direction: 'left' | 'right' } | null>(null);
  const card = data?.items?.[0];
  const direction = leaving && leaving.id === card?.candidateId ? leaving.direction : null;

  // The card swipes away while the request runs; success swaps in the next card, failure brings it back.
  const decide = (action: 'like' | 'pass') => {
    if (!card) return;
    setLeaving({ id: card.candidateId, direction: action === 'like' ? 'right' : 'left' });
    act(
      { candidateId: card.candidateId, mode: filters.mode, action },
      {
        onSuccess: ({ matched }) => {
          if (matched) toast.success(t('connections.matched'));
        },
        onError: () => {
          setLeaving(null);
          toast.error(t('apiState.error'));
        },
      },
    );
  };

  if (isPending) {
    return (
      <Skeleton loading label={t('apiState.loading')}>
        <UIPanel inert className={panelClass} />
      </Skeleton>
    );
  }

  if (!card) {
    return (
      <UIPanel className={cn(panelClass, 'items-center justify-center')}>
        {isError ? (
          <UIQueryError retry={() => void refetch()} />
        ) : (
          <UIEmpty>
            <div className="space-y-2">
              <h2 className="text-card-title font-bold tracking-[-0.6px]">
                {t('connections.emptyTitle')}
              </h2>
              <p className="max-w-sm text-base text-white-80">
                {t('connections.emptyDescription')}
              </p>
            </div>
          </UIEmpty>
        )}
      </UIPanel>
    );
  }

  return (
    <UIPanel
      key={card.candidateId}
      className={cn(
        panelClass,
        direction === 'left' && 'animate-swipe-left',
        direction === 'right' && 'animate-swipe-right',
        !direction && 'motion-safe:animate-rise-in',
      )}
    >
      <CandidateCard card={card} />
      <div className="px-6 pb-6">
        <DiscoveryActions
          disabled={isActing}
          onPass={() => decide('pass')}
          onConnect={() => decide('like')}
        />
      </div>
    </UIPanel>
  );
}

function CandidateCard({ card }: { card: DiscoveryCard }) {
  const { t } = useTranslation();
  const { data: universities = [] } = useUniversities();
  const university = universities.find(({ id }) => id === card.universityId)?.name;
  const shared = new Set(card.sharedInterests?.map((interest) => interest.toLowerCase()));
  const meta = [university, card.level && t(studyLevelLabels[card.level])]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-profile-name font-bold tracking-[-1.2px]">
            {card.age === null
              ? t('connections.anonymousStudent')
              : `${t('connections.anonymousStudent')}, ${card.age}`}
          </h2>
          {meta && <p className="mt-1 text-base font-medium text-white-80">{meta}</p>}
        </div>
        <ReportButton targetType="candidate" targetId={card.candidateId} compact />
      </div>
      {card.intent && (
        <div>
          <p className="mb-2 text-detail text-sky">{t('connections.iWantTo')}</p>
          <p className="text-section leading-[1.4] font-medium">{card.intent}</p>
        </div>
      )}
      {card.bio && <p className="text-base text-white-80">{card.bio}</p>}
      {card.interests && card.interests.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label={t('connections.interests')}>
          {card.interests.map((interest) => {
            const isShared = shared.has(interest.toLowerCase());
            return (
              <li key={interest} className={cn('app-tag', isShared && 'text-sky')}>
                {interest}
                {isShared && <span className="sr-only">, {t('connections.sharedInterest')}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
