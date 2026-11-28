import { cva } from 'class-variance-authority';

export const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition-[color,background-color,border-color,scale] outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:opacity-40 motion-safe:enabled:active:scale-[0.97] max-lg:disabled:opacity-50 max-lg:aria-disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'min-h-10 px-4.5 py-2.5 text-label leading-[1.2]',
        md: 'min-h-12 px-5.5 py-3.5 text-body leading-[1.2]',
        lg: 'min-h-12 px-6 py-3 text-base',
        pill: 'min-h-9 px-4 py-2 text-label leading-[1.2]',
        icon: 'size-9.5 p-2',
        // the mobile app's UIIconButton: a 40px rounded square
        square: 'size-10 shrink-0 rounded-xl p-0',
      },
      bg: {
        primary: 'border-white bg-white text-ink enabled:hover:bg-white/85',
        secondary: 'border-white-10 bg-white-5 text-white enabled:hover:bg-white-20',
        ghost: 'border-white-10 bg-transparent text-white enabled:hover:bg-white-10',
        danger: 'border-danger bg-danger text-white enabled:hover:bg-danger-hover',
        transparent: 'border-transparent bg-transparent text-white enabled:hover:bg-white-10',
        // Icon-only actions: no surface, the icon lights up on hover.
        plain: 'border-transparent bg-transparent text-secondary enabled:hover:text-white',
        gradient: 'border-white bg-white text-ink enabled:hover:bg-white/85',
        // the mobile app's UIGlass: a frosted surface, dimmed while pressed
        glass:
          'border-white-10 bg-surface-60 text-white backdrop-blur-xl enabled:hover:bg-white-10 enabled:active:opacity-80',
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
  primary: 'text-ink',
  gray: 'text-secondary',
} as const;
