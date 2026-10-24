import { cva } from 'class-variance-authority';

export const rowstyles = cva(
  'flex flex-row items-center justify-between gap-3 rounded-xl border px-3.5 py-1.5 text-left [@media(max-height:800px)]:py-1',
  {
    variants: {
      selected: {
        true: 'border-blue bg-ice',
        false: 'border-gray',
      },
    },
    defaultVariants: { selected: false },
  },
);
