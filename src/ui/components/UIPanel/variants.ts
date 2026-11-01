import { cva } from 'class-variance-authority';

export const panelStyles = cva('rounded-card border border-white-10 p-5', {
  variants: {
    surface: {
      glass:
        // Blur on ::before: a backdrop-filter on the panel itself would stop glass menus inside it from blurring.
        'relative isolate bg-surface-60 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:backdrop-blur-[48px]',
      tint: 'bg-white-5',
    },
  },
  defaultVariants: { surface: 'glass' },
});
