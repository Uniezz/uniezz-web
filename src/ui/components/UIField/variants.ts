import { cva } from 'class-variance-authority';

export const fieldStyles = cva(
  'flex min-w-0 flex-col gap-1.5 text-micro font-semibold text-secondary',
);

export const fieldHintStyles = cva('font-medium transition-colors', {
  variants: { invalid: { true: 'text-warning', false: 'text-muted' } },
});

export const fieldCounterStyles = cva(
  'pointer-events-none absolute right-3 bottom-2 text-[11px] font-medium tabular-nums transition-colors',
  { variants: { invalid: { true: 'text-warning', false: 'text-muted' } } },
);
