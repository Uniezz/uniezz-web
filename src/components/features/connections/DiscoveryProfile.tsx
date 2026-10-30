import { useTranslation } from 'react-i18next';

import { CONNECTIONSMOCKS } from '@/utils';
import { UIButton, UIEmpty, UIPanel } from '@/ui/components';

export function DiscoveryProfile({
  showProfile,
  onReset,
}: {
  showProfile: boolean;
  onReset: () => void;
}) {
  const { t } = useTranslation();
  return (
    <UIPanel className="overflow-hidden rounded-feature p-0">
      {showProfile ? (
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
            <div className="absolute right-6 bottom-6 left-6">
              <h2 className="text-profile-name font-bold tracking-[-1.2px]">
                {CONNECTIONSMOCKS.title}
              </h2>
              <p className="mt-1 text-base font-medium text-white-80">{CONNECTIONSMOCKS.meta}</p>
            </div>
          </div>
          <div className="space-y-3 px-5.5 py-4.5">
            <div className="rounded-programme border border-white-10 bg-white-5 px-4.5 py-4">
              <p className="mb-2 text-detail text-sky">{CONNECTIONSMOCKS.prompt}</p>
              <p className="text-section leading-[1.4] font-medium">{CONNECTIONSMOCKS.bio}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Coffee', 'Film', 'Travel', 'Books', 'Radio'].map((interest) => (
                <span key={interest} className="app-tag">
                  {interest}
                </span>
              ))}
              <span className="ml-auto text-detail text-secondary">{CONNECTIONSMOCKS.mutual}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="p-6">
          <UIEmpty />
          <UIButton
            bg="secondary"
            onClick={() => {
              onReset();
            }}
          >
            {t('app.reset')}
          </UIButton>
        </div>
      )}
    </UIPanel>
  );
}
