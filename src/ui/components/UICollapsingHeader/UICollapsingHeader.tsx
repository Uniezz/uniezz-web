import { ArrowLeft } from 'lucide-react';
import { type ReactNode } from 'react';
import { cn } from '../../cn';
import { UIButton } from '../UIButton';

export type UICollapsingHeaderProps = {
  title: string;
  /** Once the list is scrolled: blurred backdrop and a slightly smaller title. */
  isCompact: boolean;
  /** Shows a back arrow before the title. */
  onBack?: () => void;
  backLabel?: string;
  /** Icon buttons after the title. */
  actions?: ReactNode;
  /** Pinned under the title row, edge to edge, such as sub-tabs. */
  children?: ReactNode;
  className?: string;
};

/**
 * Phone-only: the mobile app's pinned large-title header of a pushed screen. It sits in a
 * container with 16px side padding and bleeds over it.
 */
export const UICollapsingHeader = ({
  title,
  isCompact,
  onBack,
  backLabel,
  actions,
  children,
  className,
}: UICollapsingHeaderProps) => (
  <header
    data-compact={isCompact || undefined}
    className={cn(
      'sticky top-0 isolate z-30 -mx-4 px-4 pt-[max(8px,env(safe-area-inset-top))]',
      // a light ink tint, so content stays visible, blurred, as it passes under the header
      'before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-ink-40 before:opacity-0 before:backdrop-blur-xl before:transition-opacity data-compact:before:opacity-100',
      children ? 'pb-0' : 'pb-3',
      className,
    )}
  >
    <div className="flex min-w-0 items-center gap-2">
      {onBack && (
        <UIButton
          size="square"
          bg="glass"
          aria-label={backLabel}
          data-ph-capture-attribute-label="Go back"
          onClick={onBack}
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </UIButton>
      )}
      <h1
        className={cn(
          '-my-[0.2em] min-w-0 flex-1 origin-left truncate py-[0.2em] text-[30px] leading-[30px] font-bold tracking-[-1px] transition-transform motion-reduce:transition-none',
          isCompact && 'scale-92',
        )}
      >
        {title}
      </h1>
      {actions}
    </div>
    {children && <div className="-mx-4 mt-3">{children}</div>}
  </header>
);
