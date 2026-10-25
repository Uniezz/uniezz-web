import { cva } from 'class-variance-authority';

export const topbarStyles = cva(
  'flex h-17 items-center gap-5 border-b border-white-tertiary bg-white-primary px-7',
);

export const topbarTitleStyles = cva(
  'text-[19px] leading-tight font-extrabold tracking-[-0.2px] text-primary',
);

export const topbarSubtitleStyles = cva('text-[12px] font-normal text-muted');

export const topbarSearchStyles = cva(
  'flex w-100 items-center gap-2.25 rounded-lg border border-white-tertiary bg-white-secondary px-3 py-2.25 focus-within:border-blue-light',
);

export const topbarControlStyles = cva(
  'outline-none focus-visible:ring-2 focus-visible:ring-blue-light',
  {
    variants: {
      kind: {
        chip: 'gap-1.5 px-2.5 py-2',
        icon: 'relative size-9.5',
      },
    },
  },
);
