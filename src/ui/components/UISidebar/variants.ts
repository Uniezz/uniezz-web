import { cva } from 'class-variance-authority';

export const sidebarStyles = cva(
  'flex shrink-0 flex-col gap-1 overflow-hidden border-r border-white-10 bg-white-5 px-3.5 py-6 transition-[width] duration-200 ease-out motion-reduce:transition-none',
  {
    variants: {
      collapsed: {
        true: 'w-17',
        false: 'w-58',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  },
);

export const sidebarGroupStyles = cva('flex flex-col gap-1', {
  variants: {
    collapsed: {
      true: 'w-10',
      false: '',
    },
    section: {
      true: 'pt-2.5 pb-1',
      false: '',
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

export const sidebarUserStyles = cva('mt-auto flex items-center rounded-[14px]', {
  variants: {
    collapsed: {
      true: 'w-10 justify-center p-1',
      false: 'gap-2.5 p-2.5',
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});
