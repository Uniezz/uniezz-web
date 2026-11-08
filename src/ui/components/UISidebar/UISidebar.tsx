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
const CAT_SIZE = 24;

// Jumps the cat between tabs, which sit one above another, following how real cats jump:
// 1. a long, deep crouch with the weight on the hind legs;
// 2. takeoff, where the body stretches to its longest;
// 3. flight, seen from behind, front paws reaching toward the target tab
//    (up when climbing, down when dropping);
// 4. landing front paws first, then the hind legs with a squash, then settling into a sit.
function jumpCat(cat: HTMLElement, fromOffset: number) {
  const distance = Math.abs(fromOffset);
  const goingDown = fromOffset < 0;
  const lift = 8 + Math.min(distance * 0.08, 12);
  // Up: the peak is just above the landing, late. Down: a short hop off the start, early.
  const apex = goingDown ? { offset: 0.44, y: fromOffset - lift } : { offset: 0.62, y: -lift };
  const timing = { duration: 520 + Math.min(distance, 300) * 0.9 };
  const launch = 'cubic-bezier(0.2, 0.8, 0.3, 1)';
  const fall = 'cubic-bezier(0.6, 0, 0.9, 0.5)';

  cat.animate(
    [
      { transform: `translate(0, ${fromOffset}px)` },
      { offset: 0.12, transform: `translate(0, ${fromOffset}px) scale(1.1, 0.85)` },
      {
        offset: 0.26,
        transform: `translate(0, ${fromOffset}px) scale(1.2, 0.75)`,
        easing: 'cubic-bezier(0.5, 0, 0.2, 1)',
      },
      {
        offset: 0.34,
        transform: `translate(0, ${fromOffset - 6}px) scale(0.85, 1.25)`,
        easing: launch,
      },
      { offset: apex.offset, transform: `translate(-3px, ${apex.y}px)`, easing: fall },
      { offset: 0.8, transform: 'translate(0, 0) rotate(10deg) scale(1.05, 0.92)' },
      { offset: 0.88, transform: 'translate(0, 0) scale(1.2, 0.8)' },
      { offset: 0.95, transform: 'translate(0, -1px) scale(0.98, 1.03)' },
      { transform: 'none' },
    ],
    timing,
  );

  // Sitting while crouching and landing, the back view in the air.
  const flip = goingDown ? 'scale(1, -1)' : '';
  cat
    .querySelector('[data-pose="sit"]')
    ?.animate(
      [
        { opacity: 1 },
        { offset: 0.28, opacity: 1 },
        { offset: 0.32, opacity: 0 },
        { offset: 0.76, opacity: 0 },
        { offset: 0.79, opacity: 1 },
        { opacity: 1 },
      ],
      timing,
    );
  // The body keeps moving in the air: stretched after launch, gathered in at the peak, reaching
  // out again for the landing, swaying a little as the tail balances.
  const stretched = `${flip} scale(0.9, 1.18)`;
  cat.querySelector('[data-pose="leap"]')?.animate(
    [
      { opacity: 0, transform: stretched },
      { offset: 0.28, opacity: 0, transform: stretched },
      { offset: 0.32, opacity: 1, transform: stretched },
      { offset: 0.5, transform: `${flip} rotate(-6deg) scale(1.1, 0.88)` },
      { offset: 0.68, transform: `${flip} rotate(5deg) scale(0.92, 1.15)` },
      { offset: 0.76, opacity: 1, transform: `${flip} scale(0.95, 1.1)` },
      { offset: 0.79, opacity: 0, transform: `${flip} scale(0.95, 1.1)` },
      { opacity: 0, transform: flip || 'none' },
    ],
    timing,
  );
}

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

  const catRef = useRef<HTMLSpanElement>(null);
  const catTop = highlight && highlight.top + highlight.height - CAT_SIZE - 1;
  const previousCatTop = useRef<number | null>(null);
  useLayoutEffect(() => {
    // Mid-navigation there can briefly be no active link; keep the last real spot to jump from.
    if (catTop === null) return;
    const from = previousCatTop.current;
    previousCatTop.current = catTop;
    if (
      catRef.current &&
      from !== null &&
      from !== catTop &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      jumpCat(catRef.current, from - catTop);
    }
  }, [catTop]);

  return (
    <aside className={cn(sidebarStyles(), className)} {...props}>
      <Link
        to="/feed"
        data-ph-capture-attribute-label={t('common.appName')}
        className="mb-5.5 px-2.5 text-lg font-semibold tracking-[-0.6px]"
      >
        {t('common.appName')}
      </Link>
      <nav ref={navRef} aria-label={t('sidebar.mainNavigation')} className="relative flex flex-col">
        {NAV_GROUPS.map(({ section, items }) => (
          <div
            key={section ?? 'main'}
            className={sidebarGroupStyles({ section: Boolean(section) })}
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
        />
        {/* Outside the highlight so it can jump on its own path while the highlight slides. */}
        <span
          ref={catRef}
          aria-hidden="true"
          style={catTop === null ? undefined : { top: catTop }}
          className={cn(
            'pointer-events-none absolute right-1.25 size-6 origin-bottom',
            catTop === null && 'hidden',
          )}
        >
          <span
            data-pose="sit"
            className="absolute inset-0 bg-[url(/app/sidebar-cat.png)] bg-contain bg-center bg-no-repeat"
          />
          {/* Mid-air pose, only shown during a jump. */}
          <img
            data-pose="leap"
            src="/app/sidebar-cat-leap.svg"
            alt=""
            className="absolute -top-0.5 left-1 h-7 w-4.25 max-w-none opacity-0"
          />
        </span>
      </nav>
      <Link
        to="/profile"
        data-ph-capture-attribute-label={t('app.profile')}
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
