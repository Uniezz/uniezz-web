import { useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// TODO(api): Replace the mock discovery profile with API-backed profile data.
import { CONNECTIONSMOCKS } from '@/utils';
import { UIButton, UIEmptyCat, UIPanel } from '@/ui/components';
import { cn } from '@/ui/cn';

export function DiscoveryProfile({
  showProfile,
  leaving = null,
  onLeft,
  onReset,
  children,
}: {
  showProfile: boolean;
  leaving?: 'left' | 'right' | null;
  onLeft?: () => void;
  onReset: () => void;
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  const [photo, setPhoto] = useState(0);
  const { photos } = CONNECTIONSMOCKS;
  const profileCard = (
    <>
      <div className="relative h-100 shrink-0 xl:h-auto xl:min-h-0 xl:flex-1">
        {/* The photo fades out at the bottom into the card itself, so the bio continues it with no seam. */}
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
          <img
            src={photos[photo]}
            alt={`${CONNECTIONSMOCKS.name} ${photo + 1}`}
            className="size-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        </div>
        {photos.length > 1 && (
          <>
            <UIButton
              size="icon"
              bg="secondary"
              aria-label={t('postComposer.previousPhoto')}
              disabled={photo === 0}
              onClick={() => setPhoto(photo - 1)}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-surface"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </UIButton>
            <UIButton
              size="icon"
              bg="secondary"
              aria-label={t('postComposer.nextPhoto')}
              disabled={photo === photos.length - 1}
              onClick={() => setPhoto(photo + 1)}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-surface"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </UIButton>
            <span aria-live="polite" className="app-tag absolute top-4 right-4">
              {photo + 1} / {photos.length}
            </span>
          </>
        )}
        <div className="absolute inset-x-6 bottom-2 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-profile-name font-bold tracking-[-1.2px]">
              {CONNECTIONSMOCKS.title}
            </h2>
            <p className="mt-1 text-base font-medium text-white-80">{CONNECTIONSMOCKS.meta}</p>
          </div>
          {children && <div className="shrink-0">{children}</div>}
        </div>
      </div>
      <div className="space-y-4 px-6 pt-3 pb-6">
        <div>
          <p className="mb-2 text-detail text-sky">{CONNECTIONSMOCKS.prompt}</p>
          <p className="text-section leading-[1.4] font-medium">{CONNECTIONSMOCKS.bio}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {CONNECTIONSMOCKS.candidate.interests.map((interest) => (
            <span key={interest} className="app-tag">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </>
  );
  return (
    <UIPanel
      key={showProfile ? 'profile' : 'empty'}
      className={cn(
        // On wide screens the card fills the rest of the viewport and the photo takes the spare height.
        'relative flex flex-col overflow-hidden rounded-feature p-0 xl:h-[calc(100svh-9.5rem)] xl:min-h-140',
        leaving === 'left' && 'animate-swipe-left',
        leaving === 'right' && 'animate-swipe-right',
        !leaving && 'motion-safe:animate-rise-in',
      )}
      onAnimationEnd={(event) => {
        if (leaving && event.target === event.currentTarget) onLeft?.();
      }}
    >
      {showProfile ? (
        profileCard
      ) : (
        <>
          {/* An invisible profile card holds the exact size, so the layout doesn't move when the last profile is gone. */}
          <div aria-hidden="true" inert className="invisible">
            {profileCard}
          </div>
          <div role="status" className="absolute inset-0 flex flex-col">
            <UIEmptyCat className="min-h-0 flex-1" />
            <div className="flex flex-col gap-4 p-6">
              <div className="space-y-2">
                <h2 className="text-card-title font-bold tracking-[-0.6px]">
                  {t('connections.emptyTitle')}
                </h2>
                <p className="max-w-sm text-base text-white-80">
                  {t('connections.emptyDescription')}
                </p>
              </div>
              <UIButton bg="secondary" size="pill" className="self-start" onClick={onReset}>
                {t('app.reset')}
              </UIButton>
            </div>
          </div>
        </>
      )}
    </UIPanel>
  );
}
