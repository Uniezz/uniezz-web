import { cva } from 'class-variance-authority';

export const inputStyles = cva(
  // on a phone, the mobile app's UIInput: 48 high, white 3% fill, 14/8 padding; 16px text so iOS does not zoom in
  'flex min-h-10 items-center gap-2 rounded-xl border bg-white-5 px-3 py-2.5 text-label focus-within:border-white-60 has-disabled:opacity-40 max-lg:min-h-12 max-lg:gap-2.5 max-lg:bg-white-3 max-lg:py-0 max-lg:pr-2 max-lg:pl-3.5 max-lg:text-base max-lg:has-disabled:opacity-50',
  {
    variants: {
      error: {
        true: 'border-danger',
        false: 'border-white-10 max-lg:border-white-12',
      },
    },
    defaultVariants: {
      error: false,
    },
  },
);
