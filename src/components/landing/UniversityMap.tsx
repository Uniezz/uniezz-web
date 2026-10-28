import { useTranslation } from 'react-i18next';
import { UniversityMapCanvas } from './UniversityMapCanvas';
import type { University } from '@/@types/auth';

export function UniversityMap({
  universities,
  isLoading,
  isError,
}: {
  universities: University[];
  isLoading: boolean;
  isError: boolean;
}) {
  const { t } = useTranslation();

  return (
    <section aria-label={t('landing.map.eyebrow')} className="px-6 py-14 md:px-14 md:py-19">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-16">
        <div>
          <p className="font-mono text-[10px] tracking-widest text-white/60">
            {t('landing.map.eyebrow')}
          </p>
          <h2 className="mt-3 text-[clamp(38px,4.2vw,60px)] leading-[1.05] font-medium tracking-[-0.055em] text-[#f2eee6]">
            {t('landing.map.title')}
          </h2>
        </div>
        <p className="max-w-100 text-sm leading-6 text-white/60 md:text-base">
          {t('landing.map.description')}
        </p>
      </div>

      <UniversityMapCanvas universities={universities} isLoading={isLoading} isError={isError} />
    </section>
  );
}
