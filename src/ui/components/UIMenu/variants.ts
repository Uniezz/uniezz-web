import { cva } from 'class-variance-authority';

export const menuStyles = cva(
  'absolute top-full right-0 z-10 mt-2 flex w-56 flex-col gap-0.5 rounded-xl border border-white-tertiary bg-white-primary p-1.5 shadow-[0_8px_24px_#2D419526]',
);

export const menuOptionStyles = cva(
  'w-full justify-start gap-3 border-transparent px-3 py-2.5 text-sm font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-blue-light',
  {
    variants: {
      active: {
        true: 'bg-blue-soft',
        false: 'bg-white-primary enabled:hover:bg-white-secondary',
      },
    },
  },
);
