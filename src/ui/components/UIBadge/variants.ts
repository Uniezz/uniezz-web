import { cva } from 'class-variance-authority';

export const badgeStyles = cva('inline-flex items-center rounded-full font-bold', {
  variants: {
    variant: {
      count: 'min-h-5 min-w-5 justify-center bg-blue px-1.75 text-micro leading-none text-white',
      warning: 'gap-1.5 bg-amber-10 px-2.75 py-1.25 text-caption leading-none text-amber',
    },
  },
  defaultVariants: {
    variant: 'count',
  },
});

export const badgeDotStyles = 'size-1.5 rounded-full bg-amber';
