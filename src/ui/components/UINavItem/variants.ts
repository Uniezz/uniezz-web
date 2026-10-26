import { cva } from 'class-variance-authority';

export const navItemStyles = cva('flex w-full items-center rounded-xl py-2.5 transition-colors', {
  variants: {
    active: {
      true: 'bg-white/15',
      false: 'hover:bg-white/10',
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
});

export const navItemIconStyles = cva('shrink-0', {
  variants: {
    active: {
      true: 'text-white',
      false: 'text-white/60',
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const navItemLabelStyles = cva('truncate text-regular', {
  variants: {
    active: {
      true: 'font-semibold text-white',
      false: 'font-medium text-white/70',
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const navItemBadgeStyles = cva(
  'ml-auto shrink-0 rounded-full px-1.75 py-0.5 text-caption font-bold text-white',
  {
    variants: {
      active: {
        true: 'bg-blue',
        false: 'bg-blue/70',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
