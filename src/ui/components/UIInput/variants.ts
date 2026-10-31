import { cva } from 'class-variance-authority';

export const inputStyles = cva(
  'flex min-h-10 items-center gap-2 rounded-xl border bg-white-5 px-3 py-2.5 text-label focus-within:border-white-60 has-disabled:opacity-40',
  {
    variants: {
      error: {
        true: 'border-danger',
        false: 'border-white-10',
      },
    },
    defaultVariants: {
      error: false,
    },
  },
);
