import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../cn';
import { emptyStyles } from './variants';

export type UIEmptyProps = {
  /** Replaces the default message */
  children?: ReactNode;
};

export const UIEmpty = ({ children }: UIEmptyProps) => {
  const { t } = useTranslation();
  return (
    <div role="status" className={emptyStyles()}>
      <CatScene className="h-36" />
      <div className="relative z-10 px-6 pb-6">{children ?? <p>{t('app.empty')}</p>}</div>
    </div>
  );
};

/** The animated black cat in its own night-sky window, for layouts that place the text themselves. */
export const UIEmptyCat = ({ className }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={cn(
      'nav-item-active relative overflow-hidden rounded-2xl border border-white-10 after:hidden',
      className,
    )}
  >
    <CatScene className="absolute inset-0" />
  </div>
);

function CatScene({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('relative', className)}>
      {/* Contact shadow, so the cat sits on something instead of floating. */}
      <span className="absolute bottom-[4%] left-1/2 z-10 h-[7%] w-[34%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-[3px]" />
      {/* Animated SVG (SMIL); an <img> keeps it out of the JS bundle and still plays it. */}
      <img
        src="/app/empty-cat.svg"
        alt=""
        className="absolute inset-x-0 bottom-0 z-10 mx-auto h-[88%] w-auto max-w-none"
      />
    </div>
  );
}
