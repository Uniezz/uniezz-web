import { Link, useRouterState } from '@tanstack/react-router';
import { useLayoutEffect, useRef, useState, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../cn';
import { UINavItem } from '../UINavItem';
import { NAV_GROUPS } from '@/utils/navigation';
import { sidebarStyles, sidebarGroupStyles, sidebarUserStyles } from './variants';
export type UISidebarProps = ComponentProps<'aside'> & {
  user: { initials: string; name: string; meta: string; avatar?: string };
  counts?: Record<string, number>;
};
export function UISidebar({ user, counts, className, ...props }: UISidebarProps) {
  const { t } = useTranslation();
  const navRef = useRef<HTMLElement>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [highlight, setHighlight] = useState<{ top: number; height: number } | null>(null);

  // CSS can't animate a move between anchors, so the highlight follows the active link by measurement.
  useLayoutEffect(() => {
    const active = navRef.current?.querySelector<HTMLElement>('a[aria-current="page"]');
    setHighlight(active ? { top: active.offsetTop, height: active.offsetHeight } : null);
  }, [pathname]);

  return (
    <aside className={cn(sidebarStyles(), className)} {...props}>
      <Link to="/feed" className="mb-5.5 px-2.5 text-lg font-semibold tracking-[-0.6px]">
        {t('common.appName')}
      </Link>
      <nav ref={navRef} aria-label={t('sidebar.mainNavigation')} className="relative flex flex-col">
        {NAV_GROUPS.map(({ titleKey, items }) => (
          <div
            key={titleKey ?? 'main'}
            className={sidebarGroupStyles({ section: Boolean(titleKey) })}
          >
            {items.map(({ labelKey, ...item }) => (
              <UINavItem key={item.to} {...item} label={t(labelKey)} count={counts?.[item.to]} />
            ))}
          </div>
        ))}
        <span
          aria-hidden="true"
          style={highlight ?? undefined}
          className={cn(
            'nav-item-active pointer-events-none absolute inset-x-0 rounded-xl border border-white-10 transition-[top,height] duration-300 ease-out after:hidden motion-reduce:transition-none',
            !highlight && 'hidden',
          )}
        >
          {/* Keyed by path so the hop replays on every navigation. */}
          <span
            key={pathname}
            className="absolute right-1 bottom-0 size-6 origin-bottom bg-[url('/app/sidebar-cat.png')] bg-contain bg-center bg-no-repeat motion-safe:animate-[cat-hop_450ms_cubic-bezier(0.3,0.7,0.4,1)]"
          />
        </span>
      </nav>
      <Link
        to="/profile"
        aria-label={t('app.profile')}
        className={cn(
          sidebarUserStyles(),
          'border border-transparent focus-visible:outline-2 focus-visible:outline-blue',
        )}
        activeProps={{ className: 'nav-item-active border border-white-10' }}
      >
        <span className="relative z-10 flex min-w-0 items-center gap-2.5">
          <img
            src={user.avatar ?? '/app/avatar.png'}
            alt=""
            className="size-8.5 shrink-0 rounded-full object-cover"
          />
          <span className="flex min-w-0 flex-col gap-1">
            <strong className="truncate text-label">{user.name}</strong>
            <span className="truncate text-detail text-secondary">{user.meta}</span>
          </span>
        </span>
      </Link>
    </aside>
  );
}
