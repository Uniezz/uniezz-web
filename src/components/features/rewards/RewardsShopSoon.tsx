import { useTranslation } from 'react-i18next';
import { usePhoneViewport } from '@/hooks';
import { UICoin, UIPanel } from '@/ui/components';

/** Placeholder for spending coins: a blurred shop with a "coming soon" note on top. */
export function RewardsShopSoon() {
  const { t } = useTranslation();
  const isPhone = usePhoneViewport();
  if (isPhone) {
    // the mobile app's ShopPreview: one featured card, eight in two columns, blurred under the note
    return (
      <div className="relative overflow-hidden rounded-2xl">
        <div
          aria-hidden="true"
          inert
          className="pointer-events-none flex flex-col gap-3 select-none"
        >
          <div className="flex items-center gap-3 rounded-2xl p-3 glass">
            <div className="size-24 shrink-0 rounded-xl bg-amber-10" />
            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
              <div className="h-3 w-4/5 rounded-full bg-white-10" />
              <div className="h-2.5 w-1/2 rounded-full bg-white-10" />
              <div className="flex items-center gap-1.5">
                <UICoin />
                <div className="h-2.5 w-[30%] rounded-full bg-white-10" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="flex flex-col gap-2.5 rounded-2xl p-3 glass">
                <div className="h-24 rounded-xl bg-white-10" />
                <div className="h-3 w-4/5 rounded-full bg-white-10" />
                <div className="flex items-center gap-1.5">
                  <UICoin className="size-3" />
                  <div className="h-2.5 w-[30%] rounded-full bg-white-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-ink-40 px-6 backdrop-blur-md">
          <div className="flex flex-col gap-1.5 text-center">
            <p className="text-[21px] leading-tight font-semibold">{t('rewards.shopSoon')}</p>
            <p className="text-body text-secondary">{t('rewards.shopSoonDescriptionApp')}</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      {/* Shape only, no invented items: the shop's contents aren't decided yet. */}
      <div
        aria-hidden="true"
        inert
        className="pointer-events-none grid gap-5 blur-sm select-none max-lg:gap-3 max-sm:grid-cols-2 sm:grid-cols-2 xl:grid-cols-3"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <UIPanel
            key={index}
            className="space-y-4 max-lg:space-y-2.5 max-lg:rounded-2xl max-lg:p-3"
          >
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
          <p className="text-section font-semibold max-lg:text-lg">{t('rewards.shopSoon')}</p>
          <p className="text-label text-secondary">{t('rewards.shopSoonDescription')}</p>
        </div>
      </div>
    </div>
  );
}
