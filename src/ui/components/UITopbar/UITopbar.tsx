import { type ComponentProps } from 'react';
import { cn } from '../../cn';
import { topbarStyles, topbarSubtitleStyles, topbarTitleStyles } from './variants';

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
    </header>
  );
};
