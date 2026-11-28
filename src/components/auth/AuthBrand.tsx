import { Link } from '@tanstack/react-router';
import { LockKeyhole } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AuthBrand() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col justify-between py-2 max-lg:py-0 lg:min-h-[calc(100svh-64px)]">
      <Link
        to="/"
        data-ph-capture-attribute-label={t('common.appName')}
        aria-label={t('common.appName')}
        className="flex min-h-11 w-fit items-center gap-0.5 rounded-lg text-xxl font-semibold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue max-lg:text-[21px] max-lg:tracking-[-0.6px]"
      >
        {/* on a phone, the mobile app's plain "uniezz" wordmark */}
        <img src="/favicon.png" alt="" className="size-11 rounded-lg max-lg:hidden" />
        <span>
          <span className="lg:hidden">{t('common.appName').slice(0, 1)}</span>
          {t('common.appName').slice(1)}
        </span>
      </Link>
      <div className="max-w-130 py-8 max-lg:hidden sm:py-10 lg:py-16">
        <h1 className="max-w-115 text-4xl leading-[0.98] font-bold tracking-[-2px] text-white sm:text-5xl lg:text-[64px]">
          {t('auth.brand.headline')}
        </h1>
        <p className="mt-6 hidden max-w-110 text-sm leading-6 text-secondary sm:block">
          {t('auth.brand.description')}
        </p>
      </div>
      <p className="flex items-center gap-2 text-xs text-secondary max-lg:hidden">
        <LockKeyhole size={14} aria-hidden />
        {t('auth.brand.privacy')}
      </p>
    </div>
  );
}
