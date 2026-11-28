import { useTranslation } from 'react-i18next';

const bar = 'rounded-md bg-white-10 motion-safe:animate-pulse';

/** The mobile app's post placeholder: a card with an author line, a title, text lines and an image block. */
export function PostCardSkeleton() {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      aria-label={t('apiState.loading')}
      className="flex flex-col gap-4 rounded-card border border-white/14 bg-white/3 px-1.5 pt-4 pb-1.5"
    >
      <div className="flex items-center gap-2 px-2.5">
        <span className={`size-8 rounded-full ${bar}`} />
        <span className={`h-3 w-2/5 ${bar}`} />
      </div>
      <div className="flex flex-col gap-2.5 px-2.5">
        <span className={`h-6 w-[70%] ${bar}`} />
        <span className={`h-3 w-full ${bar}`} />
        <span className={`h-3 w-full ${bar}`} />
        <span className={`h-3 w-3/5 ${bar}`} />
      </div>
      <span className={`h-45 rounded-2xl ${bar}`} />
    </div>
  );
}
