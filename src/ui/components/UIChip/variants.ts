import { cva } from 'class-variance-authority';

export const chipStyles = cva(
  'rounded-full border border-white-10 px-3 py-2 text-detail focus-visible:outline-2 focus-visible:outline-blue',
  {
    variants: { selected: { true: 'bg-white text-ink', false: 'bg-white-5 text-secondary' } },
    defaultVariants: { selected: false },
  },
);
