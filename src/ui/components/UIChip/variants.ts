import { cva } from 'class-variance-authority';

export const chipStyles = cva(
  // on a phone, the mobile app's UIChip: 7/14 padding, 13 semibold, unselected white 80%
  'rounded-full border border-white-10 px-3 py-2 text-detail transition-[color,background-color,scale] focus-visible:outline-2 focus-visible:outline-blue motion-safe:active:scale-[0.97] max-lg:px-3.5 max-lg:py-1.75 max-lg:font-semibold',
  {
    variants: {
      selected: {
        true: 'bg-white text-ink max-lg:border-white',
        false: 'bg-white-5 text-secondary max-lg:text-white-80',
      },
    },
    defaultVariants: { selected: false },
  },
);
