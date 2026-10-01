import { cva } from 'class-variance-authority';

export const rowstyles = cva('flex flex-row justify-between rounded-xl border px-3.5 py-2.5', {
  variants: {
    selected: {
      true: 'border-blue bg-ice',
      false: 'border-gray',
    },
  },
  defaultVariants: { selected: false },
});
