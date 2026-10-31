import { cva } from 'class-variance-authority';

export const fieldStyles = cva(
  'flex min-w-0 flex-col gap-1.5 text-micro font-semibold text-secondary',
);

export const fieldErrorStyles = cva('text-danger');
