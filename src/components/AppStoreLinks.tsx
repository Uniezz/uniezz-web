import { useTranslation } from 'react-i18next';
import { APP_STORES } from '@/utils';

export function AppStoreLinks() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-3">
      {APP_STORES.map((store) => (
        <a
          data-ph-capture-attribute-label={store.name}
          key={store.name}
          href={store.href}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!store.href}
          className="flex flex-1 items-center gap-3 rounded-2xl border border-white/30 bg-ink/20 p-4 text-left aria-disabled:pointer-events-none"
        >
          <svg viewBox="0 0 24 24" className="size-8 shrink-0 fill-white" aria-hidden>
            <path d={store.path} />
          </svg>
          <span>
            <span className="block text-xs tracking-widest uppercase">
              {store.href ? t('landing.appsDownload') : t('landing.appsSoon')}
            </span>
            <strong className="text-lg whitespace-nowrap">{store.name}</strong>
          </span>
        </a>
      ))}
    </div>
  );
}
