import { type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UIButton } from '../UIButton';
import { UISearch } from '../UISearch';
export type UITopbarProps = {
  title: string;
  subtitle?: string;
  action?: { label: string; icon: LucideIcon; onClick?: () => void };
  search?: { value: string; onChange: (value: string) => void; label: string };
  children?: ReactNode;
};
export function UITopbar({ title, subtitle, action, search, children }: UITopbarProps) {
  const { t } = useTranslation();
  return (
    <header className="mb-6 flex flex-wrap items-end gap-3">
      <div className="min-w-0 flex-1">
        {subtitle && (
          <p className="mb-1.5 text-body leading-[1.2] font-medium text-secondary">{subtitle}</p>
        )}
        <h1 className="text-page-title font-bold tracking-[-1.4px]">{title}</h1>
      </div>
      <Link
        to="/profile"
        aria-label={t('app.profile')}
        className="rounded-full bg-white-10 p-2 lg:hidden"
      >
        <img src="/app/avatar.png" alt="" className="size-7 rounded-full" />
      </Link>
      {search && (
        <div className="w-full sm:w-75">
          <UISearch
            {...search}
            className="gap-2.5 px-4 py-2.75 text-body backdrop-blur-[40px] [&_svg]:size-4.25"
          />
        </div>
      )}
      {children}
      {action && (
        <UIButton size="sm" leftIcon={action.icon} onClick={action.onClick}>
          {action.label}
        </UIButton>
      )}
    </header>
  );
}
