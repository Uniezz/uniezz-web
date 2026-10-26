import { cva } from 'class-variance-authority';

export const menuStyles = cva(
  'absolute top-full right-0 z-10 mt-2 flex w-56 flex-col gap-0.5 rounded-2xl border border-white/10 bg-surface p-1.5 shadow-2xl',
);

export const menuOptionStyles = cva(
  'w-full justify-start gap-3 border-transparent px-3 py-2.5 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-blue',
  {
    variants: {
      active: {
        true: 'bg-blue/20',
        false: 'bg-transparent enabled:hover:bg-white/10',
      },
    },
  },
);
