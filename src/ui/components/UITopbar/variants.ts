import { cva } from 'class-variance-authority';

export const topbarStyles = cva('flex min-h-23 items-center gap-5 bg-transparent px-7 py-5');

export const topbarTitleStyles = cva(
  'text-[26px] leading-tight font-semibold tracking-[-0.6px] text-white',
);

export const topbarSubtitleStyles = cva('text-[12px] font-medium text-secondary');

export const topbarSearchStyles = cva(
  'flex w-72 items-center gap-2.25 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/30 max-lg:hidden',
);

export const topbarControlStyles = cva(
  'outline-none focus-visible:ring-2 focus-visible:ring-blue',
  {
    variants: {
      kind: {
        chip: 'gap-1.5 px-2.5 py-2',
        icon: 'relative size-9.5',
      },
    },
  },
);
