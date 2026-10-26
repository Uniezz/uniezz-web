import { cva } from 'class-variance-authority';

export const rowstyles = cva(
  'flex w-full flex-row items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue [@media(max-height:800px)]:py-1.5',
  {
    variants: {
      selected: {
        true: 'border-blue/40 bg-blue/20',
        false: 'border-white/10 bg-white/5 hover:bg-white/10',
      },
    },
    defaultVariants: { selected: false },
  },
);
