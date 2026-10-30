import { cva } from 'class-variance-authority';

export const avatarStyles = cva(
  'flex items-center justify-center overflow-hidden rounded-full border border-white-10',
  {
    variants: {
      size: {
        sm: 'h-7 w-7',
        md: 'h-9 w-9',
        regular: 'h-11 w-11',
        lg: 'h-14 w-14',
      },
      withImage: {
        false: 'bg-blue-20',
        true: '',
      },
    },
    defaultVariants: {
      size: 'regular',
      withImage: false,
    },
  },
);

export const avatarTextStyles = cva('font-semibold text-white', {
  variants: {
    size: {
      sm: 'text-caption',
      md: 'text-sm',
      regular: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: { size: 'regular' },
});

export const avatarStatusStyles = cva('absolute rounded-full bg-success', {
  variants: {
    size: {
      sm: 'right-0.5 bottom-0.5 h-1.5 w-1.5',
      md: 'right-1 bottom-1 h-2 w-2',
      regular: 'right-1 bottom-1 h-2.5 w-2.5',
      lg: 'right-1 bottom-1 h-3 w-3',
    },
  },
  defaultVariants: {
    size: 'regular',
  },
});
