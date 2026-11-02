import { cn } from '@/ui/cn';

// Soft colored light drifting slowly behind a section. Position and color come from className.
export const Glow = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn(
      'landing-glow pointer-events-none absolute size-[42vw] rounded-full blur-[120px]',
      className,
    )}
  />
);
