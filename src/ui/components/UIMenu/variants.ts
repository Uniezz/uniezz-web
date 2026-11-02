import { cva } from 'class-variance-authority';

export const menuStyles = cva(
  'absolute top-full right-0 z-10 mt-2 flex w-max max-w-[min(20rem,calc(100vw-2rem))] min-w-60 flex-col gap-0.5 rounded-2xl border border-white-10 bg-surface-60 p-1.5 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.6)] backdrop-blur-[48px] transition-[opacity,translate] duration-150 ease-out motion-reduce:transition-none starting:-translate-y-1 starting:opacity-0',
);

export const menuOptionStyles = cva(
  'min-h-11 w-full justify-start gap-3 rounded-xl border-transparent px-2 py-1.5 text-label font-medium outline-none focus-visible:ring-2 focus-visible:ring-blue',
  {
    variants: {
      active: {
        true: 'bg-white-10 text-white',
        false: 'bg-transparent text-white-80 enabled:hover:bg-white-5 enabled:hover:text-white',
      },
    },
  },
);

export const menuIconStyles = cva('grid size-8 shrink-0 place-items-center', {
  variants: {
    active: {
      true: 'text-periwinkle',
      false: 'text-secondary',
    },
  },
});
