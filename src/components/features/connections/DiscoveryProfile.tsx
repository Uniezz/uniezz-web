import { type ReactNode } from 'react';
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
  const profileCard = (
    <>
      <div className="relative h-110">
        <img
          src="/app/kuQtw-1.jpg"
          alt={CONNECTIONSMOCKS.name}
          className="size-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
        <span className="app-tag absolute top-4 left-4">{CONNECTIONSMOCKS.distance}</span>
        <span className="app-tag absolute top-4 right-4">{CONNECTIONSMOCKS.photos}</span>
        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-profile-name font-bold tracking-[-1.2px]">
              {CONNECTIONSMOCKS.title}
            </h2>
            <p className="mt-1 text-base font-medium text-white-80">{CONNECTIONSMOCKS.meta}</p>
          </div>
          {children && <div className="shrink-0">{children}</div>}
        </div>
      </div>
      <div className="space-y-3 px-5.5 py-4.5">
        <div className="rounded-programme border border-white-10 bg-white-5 px-4.5 py-4">
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
        'relative overflow-hidden rounded-feature p-0',
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
