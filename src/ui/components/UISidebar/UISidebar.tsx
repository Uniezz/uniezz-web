import { Plus } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../cn';
import { UINavItem } from '../UINavItem';
import { NAV_GROUPS } from '@/utils/navigation';
import { sidebarStyles, sidebarGroupStyles, sidebarUserStyles } from './variants';
export type UISidebarProps = ComponentProps<'aside'> & {
  user: { initials: string; name: string; meta: string };
  counts?: Record<string, number>;
};
export function UISidebar({ user, counts, className, ...props }: UISidebarProps) {
  const { t } = useTranslation();
  return (
    <aside className={cn(sidebarStyles(), className)} {...props}>
      <Link to="/feed" className="mb-5.5 px-2.5 text-lg font-semibold tracking-[-0.6px]">
        {t('common.appName')}
      </Link>
      <nav aria-label={t('sidebar.mainNavigation')} className="flex flex-col">
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
      </nav>
      <Link
        to="/feed"
        search={{ compose: true, postId: undefined }}
        className="mt-5 flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.75 text-label font-semibold text-ink"
      >
        <Plus size={16} />
        {t('app.newPost')}
      </Link>
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
            src="/app/avatar.png"
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
