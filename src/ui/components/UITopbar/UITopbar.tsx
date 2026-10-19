import { Search } from 'lucide-react';
import { type ComponentProps } from 'react';
import { cn } from '../../cn';
import {
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
    </header>
  );
};
