import { Bell, ChevronDown, Globe, Search } from 'lucide-react';
import { type ComponentProps } from 'react';
import { cn } from '../../cn';
import {
  topbarControlStyles,
  topbarSearchStyles,
  topbarStyles,
  topbarSubtitleStyles,
  topbarTitleStyles,
} from './variants';

type UITopbarProps = ComponentProps<'header'> & {
  title: string;
  subtitle?: string;
};

export const UITopbar = ({ title, subtitle, className, ...props }: UITopbarProps) => {
  return (
    <header className={cn(topbarStyles(), className)} {...props}>
      <div className="flex min-w-0 flex-col gap-px">
        <h1 className={topbarTitleStyles()}>{title}</h1>
        {subtitle ? <p className={topbarSubtitleStyles()}>{subtitle}</p> : null}
      </div>

      {/* TODO: connect to search API */}
      <label className={topbarSearchStyles()}>
        <Search className="shrink-0 text-muted" size={16} />
        <input
          type="text"
          aria-label="Search"
          placeholder="Search posts, people, courses…"
          className="min-w-0 flex-1 bg-transparent text-sm text-primary outline-none placeholder:text-muted"
        />
      </label>

      <div className="flex-1" />

      {/* TODO: language menu when i18n will be ready */}
      <button
        type="button"
        aria-label="Change language"
        className={topbarControlStyles({ kind: 'chip' })}
      >
        <Globe className="text-secondary" size={16} />
        <span className="text-sm font-bold text-primary">EN</span>
        <ChevronDown className="text-muted" size={14} />
      </button>

      {/* TODO: notifications */}
      <button
        type="button"
        aria-label="Notifications"
        className={topbarControlStyles({ kind: 'icon' })}
      >
        <Bell className="text-secondary" size={17} />
        <span
          aria-hidden
          className="absolute top-2.25 right-2 size-2 rounded-full border-[1.5px] border-white-primary bg-danger"
        />
      </button>
    </header>
  );
};
