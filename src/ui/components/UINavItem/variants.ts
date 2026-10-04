import { cva } from 'class-variance-authority';

export const navItemStyles = cva('flex w-full items-center gap-3 rounded-lg px-3 py-2.5', {
  variants: {
    active: {
      true: 'bg-blue-light',
      false: 'hover:bg-blue',
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const navItemIconStyles = cva('shrink-0', {
  variants: {
    active: {
      true: 'text-ice',
      false: 'text-navy-muted',
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const navItemLabelStyles = cva('truncate text-regular', {
  variants: {
    active: {
      true: 'font-bold text-white-primary',
      false: 'font-semibold text-navy-text',
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const navItemBadgeStyles = cva(
  'ml-auto shrink-0 rounded-full px-1.75 py-0.5 text-caption font-bold text-ice',
  {
    variants: {
      active: {
        true: 'bg-blue',
        false: 'bg-blue-light',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
