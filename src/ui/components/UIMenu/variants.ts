import { cva } from 'class-variance-authority';

export const menuStyles = cva(
  'absolute top-full right-0 z-40 mt-2 flex w-max max-w-[min(20rem,calc(100vw-2rem))] flex-col gap-0.5 rounded-2xl border border-white-10 bg-surface-60 p-1.5 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.6)] backdrop-blur-[48px] transition-[opacity,translate] duration-150 ease-out motion-reduce:transition-none starting:-translate-y-1 starting:opacity-0',
  {
    variants: { size: { md: 'min-w-60', compact: 'min-w-55' } },
    defaultVariants: { size: 'md' },
  },
);

export const menuOptionStyles = cva(
  'min-h-11 w-full justify-start gap-3 rounded-xl border-transparent px-2 py-1.5 text-label font-medium outline-none focus-visible:ring-2 focus-visible:ring-blue',
  {
    variants: {
      active: {
        true: 'bg-white-10 text-white',
        false: 'bg-transparent text-white-80 enabled:hover:bg-white-5 enabled:hover:text-white',
      },
      size: {
        md: '',
        compact:
          'min-h-9 gap-2.5 rounded-[10px] px-2.5 py-0 font-normal text-white enabled:hover:bg-white-10 pointer-coarse:min-h-11',
      },
      danger: { true: 'text-danger enabled:hover:text-danger' },
    },
    defaultVariants: { size: 'md' },
  },
);

export const menuIconStyles = cva('grid size-8 shrink-0 place-items-center', {
  variants: {
    active: {
      true: 'text-periwinkle',
      false: 'text-secondary',
    },
    danger: { true: 'text-danger' },
  },
});
