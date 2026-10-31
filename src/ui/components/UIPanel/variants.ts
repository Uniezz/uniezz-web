import { cva } from 'class-variance-authority';

export const panelStyles = cva('rounded-card border border-white-10 p-5', {
  variants: { surface: { glass: 'bg-surface-60 backdrop-blur-[48px]', tint: 'bg-white-5' } },
  defaultVariants: { surface: 'glass' },
});
