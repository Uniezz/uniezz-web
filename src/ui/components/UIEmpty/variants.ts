import { cva } from 'class-variance-authority';

// One night-sky card: the cat on top, the message below it.
export const emptyStyles = cva(
  'nav-item-active mx-auto my-6 w-full max-w-sm overflow-hidden rounded-2xl border border-white-10 text-center text-body text-secondary after:hidden',
);
