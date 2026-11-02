import { cva } from 'class-variance-authority';

export const universityLogoStyles = cva(
  'relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-white font-bold text-ink',
  {
    variants: {
      size: {
        xs: 'size-4 text-[6px]',
        sm: 'size-5 text-[7px]',
        md: 'size-8 text-[9px]',
      },
    },
    defaultVariants: { size: 'sm' },
  },
);
