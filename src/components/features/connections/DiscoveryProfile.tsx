import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'skullet/react';
import type { ConnectionFilters, DiscoveryCard } from '@/@types';
import { useCandidateAction, useDiscovery, useUniversities } from '@/hooks';
import { ReportButton } from '@/components/features/reports';
import { UIButton, UIEmpty, UIPanel, UIQueryError, UITags } from '@/ui/components';
import { cn } from '@/ui/cn';
import { authorName, studyLevelLabels, toast } from '@/utils';
import { DiscoveryActions } from './DiscoveryActions';

const panelClass =
  'relative flex min-h-100 flex-col overflow-hidden rounded-feature p-0 xl:h-[calc(100svh-9.5rem)] xl:min-h-140';

export type DiscoveryProfileProps = { filters: ConnectionFilters };

export function DiscoveryProfile({ filters }: DiscoveryProfileProps) {
  const { t } = useTranslation();
  const { data, isPending, isFetching, isError, refetch } = useDiscovery(filters);
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

  // An emptied deck refetches the next one; keep the skeleton instead of flashing the empty state.
  if (isPending || (!card && isFetching)) {
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
      <div className="relative shrink-0 px-6 pb-6">
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
  const [photoIndex, setPhotoIndex] = useState(0);
  const university = universities.find(({ id }) => id === card.universityId)?.name;
  const shared = new Set(card.sharedInterests?.map((interest) => interest.toLowerCase()));
  const meta = [university, card.level && t(studyLevelLabels[card.level])]
    .filter(Boolean)
    .join(', ');
  const name = authorName(card.student) || t('connections.anonymousStudent');
  // Avatar first, then the other photos; the panel remounts per card, so the index starts at 0.
  const photos = card.photos?.length ? card.photos : ['/app/avatar.png'];
  const photo = photos[Math.min(photoIndex, photos.length - 1)];
  const showPhoto = (step: number) =>
    setPhotoIndex((index) => (index + step + photos.length) % photos.length);

  return (
    <>
      {/* The photo fills the whole panel, behind the text and the actions. */}
      <img src={photo} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-90 via-ink-0 to-ink-0" />
      <div className="relative flex min-h-0 flex-1 flex-col gap-4 p-6">
        <div className="flex shrink-0 items-start gap-4">
          {photos.length > 1 && (
            <div className="flex flex-1 gap-1 pt-2" aria-hidden="true">
              {photos.map((url, index) => (
                <span
                  key={url}
                  className={cn(
                    'h-1 flex-1 rounded-full',
                    index === photoIndex ? 'bg-white' : 'bg-white-40',
                  )}
                />
              ))}
            </div>
          )}
          <div className="ml-auto">
            <ReportButton targetType="candidate" targetId={card.candidateId} compact />
          </div>
        </div>
        {photos.length > 1 && (
          <div className="flex flex-1 items-center justify-between">
            <UIButton
              size="icon"
              bg="secondary"
              aria-label={t('app.previousImage')}
              onClick={() => showPhoto(-1)}
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </UIButton>
            <UIButton
              size="icon"
              bg="secondary"
              aria-label={t('app.nextImage')}
              onClick={() => showPhoto(1)}
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </UIButton>
          </div>
        )}
        <div className="mt-auto flex min-h-0 flex-col gap-4">
          <div className="shrink-0">
            <h2 className="text-profile-name font-bold tracking-[-1.2px] wrap-anywhere">
              {card.age === null ? name : `${name}, ${card.age}`}
            </h2>
            {meta && <p className="mt-1 text-base font-medium text-white-80">{meta}</p>}
          </div>
          {card.intent && (
            <div className="flex min-h-0 flex-col">
              <p className="mb-2 text-detail text-sky">{t('connections.iWantTo')}</p>
              <p className="line-clamp-3 text-section leading-[1.4] font-medium wrap-anywhere">
                {card.intent}
              </p>
            </div>
          )}
          {card.bio && (
            <p className="line-clamp-3 text-base wrap-anywhere text-white-80">{card.bio}</p>
          )}
          <UITags
            tags={card.interests}
            label={t('connections.interests')}
            highlight={(interest) => shared.has(interest.toLowerCase())}
            highlightLabel={t('connections.sharedInterest')}
            className="-mx-6 shrink-0 px-6"
          />
        </div>
      </div>
    </>
  );
}
