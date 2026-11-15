import { cva } from 'class-variance-authority';

export const subTabsStyles = cva('flex gap-6 border-b border-white-10');

export const subTabStyles = cva(
  'flex-1 border-b-2 px-1 pb-3 text-center text-label font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue',
  {
    variants: {
      selected: {
        true: 'border-white text-white',
        false: 'border-transparent text-secondary hover:text-white',
      },
    },
  },
);
