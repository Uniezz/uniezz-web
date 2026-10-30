import { cva } from 'class-variance-authority';

export const navItemStyles = cva(
  'flex w-full items-center rounded-xl border py-2.5 transition-colors',
  {
    variants: {
      active: {
        true: 'nav-item-active border-white-10',
        false: 'border-transparent hover:bg-white-5',
      },
      collapsed: {
        true: 'justify-center px-0',
        false: 'gap-3 px-3',
      },
    },
    defaultVariants: {
      active: false,
      collapsed: false,
    },
  },
);

export const navItemIconStyles = cva('shrink-0', {
  variants: {
    active: {
      true: 'text-white',
      false: 'text-white-60',
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const navItemLabelStyles = cva('truncate text-body leading-[1.2]', {
  variants: {
    active: {
      true: 'font-semibold text-white',
      false: 'font-medium text-white-60',
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const navItemBadgeStyles = cva(
  'ml-auto shrink-0 rounded-full px-1.75 py-0.25 text-micro font-bold text-white',
  {
    variants: {
      active: {
        true: 'bg-blue',
        false: 'bg-blue',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
