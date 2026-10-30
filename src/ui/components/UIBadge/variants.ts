import { cva } from 'class-variance-authority';

export const badgeStyles = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.75',
  {
    variants: {
      type: {
        warning: 'border-warning/20 bg-warning/15',
        info: 'border-blue-20 bg-blue/15',
        success: 'border-success/20 bg-success/15',
        danger: 'border-danger/20 bg-danger/15',
        counter: 'border-blue bg-blue',
        counterNegative: 'border-danger bg-danger',
        note: 'border-white-10 bg-white-5',
      },
    },
    defaultVariants: {
      type: 'info',
    },
  },
);

export const badgeTextStyles = cva('text-sm font-semibold', {
  variants: {
    color: {
      success: 'text-success',
      warning: 'text-warning',
      info: 'text-sky',
      danger: 'text-danger',
      counter: 'text-white-primary',
      counterNegative: 'text-white-primary',
      note: 'text-white/70',
    },
  },
  defaultVariants: {
    color: 'info',
  },
});
