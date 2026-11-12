import { cva } from 'class-variance-authority';

export const dialogOverlayStyles = cva('fixed inset-0 z-50', {
  variants: {
    placement: {
      center: 'bg-black/70 backdrop-blur-md',
      right: 'bg-black/40 backdrop-blur-sm',
    },
  },
  defaultVariants: { placement: 'center' },
});

export const dialogTitleStyles = cva('pr-8 text-xl font-bold');

export const dialogDescriptionStyles = cva('mt-2 mb-6 text-body text-secondary');

export const dialogCloseStyles = cva('absolute top-4 right-4');

export const dialogStyles = cva(
  'fixed z-50 border border-white-10 bg-surface p-6 text-white shadow-2xl',
  {
    variants: {
      placement: {
        center:
          'top-1/2 left-1/2 max-h-[90svh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-card',
        right: 'inset-y-0 right-0 flex h-dvh w-full max-w-2xl flex-col overflow-hidden',
      },
    },
    defaultVariants: { placement: 'center' },
  },
);
