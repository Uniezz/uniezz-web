import { cva } from 'class-variance-authority';

// Spacing between rows is padding, because Virtuoso does not measure margins.
export const messageRowStyles = cva('flex w-full min-w-0 flex-col', {
  variants: {
    align: { start: 'items-start', end: 'items-end' },
    position: { single: 'pb-3', first: 'pb-0.5', middle: 'pb-0.5', last: 'pb-3' },
  },
});
