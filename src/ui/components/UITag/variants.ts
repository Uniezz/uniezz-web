import { cva } from 'class-variance-authority';

export const tagStyles = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-micro leading-none font-semibold',
  {
    variants: {
      color: {
        accent: 'border-transparent bg-blue-20 text-sky',
        success: 'border-transparent bg-green-15 text-green',
        warning: 'border-amber-30 bg-amber-10 text-amber',
        live: 'border-transparent bg-red font-bold text-white',
        glass: 'border-white-20 bg-ink-40 text-white backdrop-blur-[12px]',
      },
    },
    defaultVariants: {
      color: 'accent',
    },
  },
);
