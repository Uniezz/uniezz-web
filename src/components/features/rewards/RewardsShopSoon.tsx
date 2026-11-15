import { useTranslation } from 'react-i18next';
import { UICoin, UIPanel } from '@/ui/components';

/** Placeholder for spending coins: a blurred shop with a "coming soon" note on top. */
export function RewardsShopSoon() {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      {/* Shape only, no invented items: the shop's contents aren't decided yet. */}
      <div
        aria-hidden="true"
        inert
        className="pointer-events-none grid gap-5 blur-sm select-none sm:grid-cols-2 xl:grid-cols-3"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <UIPanel key={index} className="space-y-4">
            <div className="aspect-video rounded-xl bg-white-5" />
            <div className="h-3 w-2/3 rounded-full bg-white-10" />
            <div className="flex items-center gap-2">
              <UICoin />
              <div className="h-3 w-10 rounded-full bg-white-10" />
            </div>
          </UIPanel>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="max-w-sm space-y-2 text-center">
          <p className="text-section font-semibold">{t('rewards.shopSoon')}</p>
          <p className="text-label text-secondary">{t('rewards.shopSoonDescription')}</p>
        </div>
      </div>
    </div>
  );
}
