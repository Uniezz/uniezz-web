import { cva } from 'class-variance-authority';

export const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60',
  {
    variants: {
      size: {
        sm: 'px-3.5 py-1.75',
        md: 'px-4.5 py-2.5',
        lg: 'px-6 py-3.25',
        pill: 'rounded-full px-1.5 py-0.75',
      },
      bg: {
        primary:
          'border border-blue-light bg-blue-light enabled:hover:border-blue enabled:hover:bg-blue',
        secondary:
          'border border-white-tertiary bg-white-primary enabled:hover:border-white-tertiary enabled:hover:bg-white-secondary',
        ghost:
          'border border-white-primary bg-white-primary enabled:hover:border-accent-soft enabled:hover:bg-accent-soft',
        danger:
          'border border-danger bg-danger enabled:hover:border-danger-hover enabled:hover:bg-danger-hover',
        gradient:
          'border-blue-light bg-blue-light bg-[linear-gradient(0deg,#FFFFFF00_0%,#FFFFFF33_100%)] enabled:hover:border-blue enabled:hover:bg-blue',
      },
    },
    defaultVariants: {
      size: 'md',
      bg: 'primary',
    },
  },
);

export const iconColorClass = {
  white: 'text-white-primary',
  primary: 'text-primary',
  gray: 'text-gray',
} as const;
