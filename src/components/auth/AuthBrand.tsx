import { Link } from '@tanstack/react-router';
import { LockKeyhole } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AuthBrand() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col justify-between py-2 md:min-h-[calc(100svh-64px)]">
      <Link
        to="/"
        aria-label={t('common.appName')}
        className="flex min-h-11 w-fit items-center gap-0.5 rounded-lg text-xxl font-semibold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
      >
        <img src="/favicon.png" alt="" className="size-11 rounded-lg" />
        <span>{t('common.appName').slice(1)}</span>
      </Link>
      <div className="max-w-130 py-8 sm:py-10 lg:py-16">
        <h1 className="max-w-115 text-4xl leading-[0.98] font-bold tracking-[-2px] text-white sm:text-5xl lg:text-[64px]">
          {t('auth.brand.headline')}
        </h1>
        <p className="mt-6 hidden max-w-110 text-sm leading-6 text-secondary sm:block">
          {t('auth.brand.description')}
        </p>
      </div>
      <p className="flex items-center gap-2 text-xs text-secondary">
        <LockKeyhole size={14} aria-hidden />
        {t('auth.brand.privacy')}
      </p>
    </div>
  );
}
