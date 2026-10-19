import { cva } from 'class-variance-authority';

export const topbarStyles = cva(
  'flex h-17 items-center gap-5 border-b border-white-tertiary bg-white-primary px-7',
);

export const topbarTitleStyles = cva(
  'text-[19px] leading-tight font-extrabold tracking-[-0.2px] text-primary',
);

export const topbarSubtitleStyles = cva('text-[12px] font-normal text-muted');
