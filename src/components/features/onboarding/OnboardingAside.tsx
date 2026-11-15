import { useTranslation } from 'react-i18next';

export const ONBOARDING_STEPS = ['photo', 'details', 'programmes'] as const;

export function OnboardingAside({ step }: { step: number }) {
  const { t } = useTranslation();
  const key = ONBOARDING_STEPS[step];

  return (
    <div className="flex flex-1 flex-col justify-between py-2 md:min-h-[calc(100svh-64px)]">
      {/* Not a link: leaving through the logo would skip onboarding without closing it. */}
      <div className="flex min-h-11 items-center gap-0.5 text-xxl font-semibold tracking-tight text-white">
        <img src="/favicon.png" alt="" className="size-11 rounded-lg" />
        <span>{t('common.appName').slice(1)}</span>
      </div>
      <div className="max-w-130 py-8 sm:py-10 lg:py-16">
        <p className="mb-5 font-mono text-xs tracking-widest text-sky uppercase">
          {t('onboarding.step', { current: step + 1, total: ONBOARDING_STEPS.length })}
        </p>
        <h1 className="max-w-115 text-4xl leading-[0.98] font-bold tracking-[-2px] text-white sm:text-5xl lg:text-[64px]">
          {t(`onboarding.${key}.title`)}
        </h1>
        <p className="mt-6 max-w-110 text-sm leading-6 text-secondary">
          {t(`onboarding.${key}.description`)}
        </p>
      </div>
      <span aria-hidden />
    </div>
  );
}
