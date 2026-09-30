import { cva } from 'class-variance-authority';

export const textStyles = cva('', {
  variants: {
    size: {
      xs: 'text-caption',
      sm: 'text-sm',
      regular: 'text-regular',
      default: 'text-[15px]',
      md: 'text-md',
      xl: 'text-xl',
      xxl: 'text-xxl',
      extra: 'text-[40px]',
    },
    weight: {
      regular: 'font-normal',
      bold: 'font-bold',
      semibold: 'font-semibold',
    },
    color: {
      primary: 'text-primary',
      secondary: 'text-secondary',
      white: 'text-white-primary',
      error: 'text-danger',
      gray: 'text-gray',
    },
  },
  defaultVariants: {
    size: 'default',
    weight: 'regular',
    color: 'primary',
  },
});
