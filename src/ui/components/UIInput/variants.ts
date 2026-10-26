import { cva } from 'class-variance-authority';

export const inputStyles = cva(
  'flex min-h-11 items-center gap-2 rounded-xl border bg-white/5 px-3.5 py-2 focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/30 has-disabled:opacity-40',
  {
    variants: {
      error: {
        true: 'border-danger',
        false: 'border-white/10',
      },
    },
    defaultVariants: {
      error: false,
    },
  },
);
