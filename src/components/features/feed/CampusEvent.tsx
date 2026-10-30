import { Check, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// TODO(api): Replace mock event details and local attendance toggle with API-backed feed data and mutations.
import { FEEDMOCKS } from '@/utils';
import { UIButton, UIPanel } from '@/ui/components';

type CampusEventProps = {
  going: boolean;
  onGoingChange: (going: boolean) => void;
};

export function CampusEvent({ going, onGoingChange }: CampusEventProps) {
  const { t } = useTranslation();
  return (
    <UIPanel className="overflow-hidden p-0">
      <div className="relative">
        <img src="/app/b4YP8L-6.jpg" alt="" className="h-52.5 w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-ink-0 to-ink-0" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="app-tag">{FEEDMOCKS.tonight}</span>
          <span className="app-tag">{FEEDMOCKS.university}</span>
        </div>
      </div>
      <div className="space-y-3 px-5.5 pt-4.5 pb-5">
        <h2 className="text-card-title font-semibold tracking-[-0.6px]">{FEEDMOCKS.eventTitle}</h2>
        <p className="text-label text-white-80">{FEEDMOCKS.eventDescription}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white-10 pt-4">
          <span className="text-label text-white-80">
            {going ? 142 : 141} {FEEDMOCKS.attendance}
          </span>
          <UIButton
            size="sm"
            bg={going ? 'primary' : 'secondary'}
            leftIcon={going ? Check : Plus}
            aria-pressed={going}
            onClick={() => onGoingChange(!going)}
          >
            {going ? t('app.going') : t('app.join')}
          </UIButton>
        </div>
      </div>
    </UIPanel>
  );
}
