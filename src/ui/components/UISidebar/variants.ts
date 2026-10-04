import { cva } from 'class-variance-authority';

export const sidebarStyles = cva(
  'flex shrink-0 flex-col overflow-hidden bg-dark-blue bg-[radial-gradient(ellipse_170%_65%_at_8%_5%,color-mix(in_srgb,var(--color-blue-light)_40%,transparent)_0%,transparent_100%),radial-gradient(ellipse_150%_55%_at_90%_96%,color-mix(in_srgb,var(--color-accent)_24%,transparent)_0%,transparent_100%)] py-5 transition-[width] duration-200 ease-out motion-reduce:transition-none',
  {
    variants: {
      collapsed: {
        true: 'w-18 px-3',
        false: 'w-66 px-4',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  },
);

export const sidebarHeaderStyles = cva('flex pt-1.5 pb-5.5', {
  variants: {
    collapsed: {
      true: 'flex-col items-center gap-2',
      false: 'items-center gap-2.5 px-1',
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

export const sidebarMarkStyles = cva(
  'flex size-8.5 shrink-0 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,var(--color-blue-light)_0%,var(--color-blue)_100%)]',
);

export const sidebarToggleStyles = cva(
  'flex size-8.5 shrink-0 items-center justify-center rounded-lg text-navy-muted outline-none hover:bg-blue hover:text-ice focus-visible:ring-2 focus-visible:ring-ice',
  {
    variants: {
      collapsed: {
        true: '',
        false: 'ml-auto',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  },
);

export const sidebarCaptionStyles = cva(
  'text-caption font-bold tracking-[0.8px] text-navy-caption',
);

export const sidebarUserStyles = cva('mt-auto flex items-center rounded-xl bg-navy-raised p-2.5', {
  variants: {
    collapsed: {
      true: 'justify-center',
      false: 'gap-2.5',
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});
