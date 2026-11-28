import { cva } from 'class-variance-authority';

export const subTabsStyles = cva('flex gap-6 border-b border-white-10', {
  variants: {
    // on a phone, tabs keep their width and the row scrolls sideways
    scrollable: { true: 'max-lg:scrollbar-hidden max-lg:overflow-x-auto', false: '' },
  },
});

export const subTabStyles = cva(
  // one line on a phone, cut with an ellipsis
  'flex-1 border-b-2 px-1 pb-3 text-center text-label font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue max-lg:min-w-0 max-lg:truncate',
  {
    variants: {
      scrollable: { true: 'max-lg:flex-none', false: '' },
      selected: {
        true: 'border-white text-white',
        false: 'border-transparent text-secondary hover:text-white',
      },
    },
  },
);
