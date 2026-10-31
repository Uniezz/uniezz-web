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

export const sidebarHeaderStyles = cva('flex items-center pt-1 pb-7');

export const sidebarMarkStyles = cva('size-10 shrink-0 overflow-hidden rounded-lg p-0');

export const sidebarSettingsStyles = cva(
  'shrink-0 rounded-md text-secondary outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-blue',
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

export const sidebarCaptionStyles = cva('text-caption font-semibold tracking-[0.8px] text-muted');

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
